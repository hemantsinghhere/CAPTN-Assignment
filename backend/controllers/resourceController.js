const Resource = require("../models/Resource");

exports.createResource = async (req, res) => {
  try {
    const resource = new Resource({ name: req.body.name, createdBy: req.user.id });
    await resource.save();
    res.status(201).json({ message: "Resource created", resource });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ createdBy: req.user.id });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { name: req.body.name },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    res.json({ message: "Resource updated", resource });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
