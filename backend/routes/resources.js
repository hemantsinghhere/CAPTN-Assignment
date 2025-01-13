const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const isAdmin = require('../middlewares/isAdmin.js');
const Resource = require('../models/Resource.js');

const router = express.Router();

// Create a resource (any logged-in user)
router.post('/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    // Create a new resource
    const newResource = new Resource({
      title,
      content,
      owner: req.user.id, // Set the owner to the authenticated user's ID
    });

    await newResource.save();
    res.status(201).json(newResource); // Return the newly created resource
  } catch (error) {
    res.status(500).json({ message: 'Failed to create resource' });
  }
});


// Update a resource (only the owner can update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    // Allow only the owner to update
    if (resource.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You are not the owner of this resource.' });
    }

    Object.assign(resource, req.body); // Update the resource with new data
    await resource.save();
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update resource.' });
  }
});

// Delete a resource (admin-only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Admin can delete any resource
    if (req.user.role === 'admin') {
      await resource.deleteOne();
      return res.status(200).json({ message: 'Resource deleted successfully' });
    }

    // Regular users can only delete their own resources
    if (resource.owner.toString() === req.user.id) {
      await resource.deleteOne();
      return res.status(200).json({ message: 'Resource deleted successfully' });
    }

    // If neither condition is met, user is unauthorized to delete the resource
    return res.status(403).json({ message: 'You are not authorized to delete this resource' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resource' });
  }
});


// Get all resources (any logged-in user)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let resources;

    if (req.user.role === 'admin') {
      // Fetch all resources if the user is an admin
      console.log("hit admin resources");
      resources = await Resource.find();
    } else {
      console.log("hit user resources");
      // Fetch only the user's resources if the user is not an admin
      resources = await Resource.find({ owner: req.user.id });
    }

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resources.' });
  }
});


// api to delete resources of other users.
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user is an admin
    if (req.user.role === 'Admin') {
      // Admin can delete any resource
      await resource.deleteOne();
      return res.status(200).json({ message: 'Resource deleted successfully' });
    }

    // If not admin, check if the resource belongs to the user
    if (resource.owner.toString() === req.user.id) {
      await resource.deleteOne();
      return res.status(200).json({message: 'Resource deleted successfully'});
    }

    if (resource.owner.toString() !== req.user.id) {
      return res.status(401).json({message: 'You are not allowed to delete this resource'});
    }

  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resource' });
  }
});


module.exports = router;
