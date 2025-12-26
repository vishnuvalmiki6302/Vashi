import { Feedback } from "../models/Feedback.js";
import { analyzeFeedbackText } from "../services/analysisService.js";
import { Parser } from "json2csv";

export async function listFeedback(req, res, next) {
  try {
    const {
      channel,
      sentiment,
      status,
      product,
      tags,
      search,
      from,
      to,
      limit = 200,
    } = req.query;
    const filter = {};
    if (channel) filter.channel = channel;
    if (sentiment) filter.sentiment = sentiment;
    if (status) filter.status = status;
    if (product) filter.product = product;
    if (tags) filter.tags = { $all: tags.split(",").map((t) => t.trim()).filter(Boolean) };

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const items = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit), 500));
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function createFeedback(req, res, next) {
  try {
    const {
      text,
      rating,
      channel = "other",
      customerId,
      customerName,
      customerEmail,
      tags = [],
      product,
      feature,
      status = "open",
    } = req.body;
    if (!text) return res.status(400).json({ message: "text is required" });

    const { sentiment, keywords, toxicity, language, summary } = analyzeFeedbackText(text);
    const feedback = await Feedback.create({
      text,
      rating,
      channel,
      customerId,
      customerName,
      customerEmail,
      tags,
      product,
      feature,
      status,
      sentiment,
      keywords,
      toxicity,
      language,
      summary,
    });
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
}

export async function feedbackStats(_req, res, next) {
  try {
    const pipeline = [
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" },
              },
            },
          ],
          sentiments: [
            {
              $group: {
                _id: "$sentiment",
                count: { $sum: 1 },
              },
            },
          ],
          tags: [
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
          ],
          keywords: [
            { $unwind: "$keywords" },
            { $group: { _id: "$keywords", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
          ],
          weekly: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%G-%V", date: "$createdAt" },
                },
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ];

    const [result] = await Feedback.aggregate(pipeline);
    const totals = result?.totals?.[0] || { count: 0, avgRating: 0 };
    const sentiments = Object.fromEntries(result.sentiments.map((s) => [s._id, s.count]));

    res.json({
      total: totals.count,
      avgRating: Number((totals.avgRating || 0).toFixed(2)),
      sentiments,
      topTags: result.tags,
      topKeywords: result.keywords,
      weekly: result.weekly,
    });
  } catch (err) {
    next(err);
  }
}

export async function exportFeedback(req, res, next) {
  try {
    const items = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(2000)
      .lean();
    const parser = new Parser();
    const csv = parser.parse(items);
    res.header("Content-Type", "text/csv");
    res.attachment("feedback_export.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

