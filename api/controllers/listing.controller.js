import Listing from "../models/listing.model.js";
import { errorHandler } from "../util/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing Not Found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "Unauthorized to delete this listing."));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Listing has been deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(401, "Listing not found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "Unauthorized to update this listing!"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedListing });
  } catch (error) {
    next(error);
  }
};
