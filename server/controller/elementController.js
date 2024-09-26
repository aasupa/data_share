// controllers/elementController.js
import ElementModel from '../models/ElementModel.js';

// Fetch all created elements
export const getCreatedElements = async (req, res) => {
  try {
    const elements = await ElementModel.find().sort({createdAt: -1}); // Fetch all elements from the DB
    res.status(200).json(elements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching elements' });
  }
};

// Create a new element
export const createElement = async (req, res) => {
  const { element, datasetName } = req.body;

  if (!element || !datasetName) {
    return res.status(400).json({ message: 'Element and dataset name are required' });
  }

  try {
    const newElement = new ElementModel({
      element,
      datasetName,
    });

    await newElement.save(); // Save the new element to the DB
    res.status(201).json(newElement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating element' });
  }
};
