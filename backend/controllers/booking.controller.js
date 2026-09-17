import { Booking } from '../models/Booking.model.js';
import { Property } from '../models/Property.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, date, timeSlot, note } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (property.agent.toString() === req.user._id.toString()) {
      throw new ApiError(400, 'Agents cannot book appointments for their own properties');
    }

    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id,
      agent: property.agent,
      date,
      timeSlot,
      note: note || '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title price images location')
      .populate('user', 'name email phone avatar')
      .populate('agent', 'name email phone avatar');

    return res
      .status(201)
      .json(
        new ApiResponse(201, populatedBooking, 'Viewing appointment booked successfully')
      );
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'agent') {
      query = { agent: req.user._id };
    } else {
      query = { user: req.user._id };
    }

    const bookings = await Booking.find(query)
      .populate('property', 'title price images location')
      .populate('user', 'name email phone avatar')
      .populate('agent', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .lean();

    return res
      .status(200)
      .json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('property')
      .populate('user', 'name email phone avatar')
      .populate('agent', 'name email phone avatar')
      .lean();

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAgent = booking.agent._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAgent && !isAdmin) {
      throw new ApiError(403, 'Not authorized to view this booking');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, booking, 'Booking retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      throw new ApiError(400, 'Invalid booking status');
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const isAgent = booking.agent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAgent && !isAdmin) {
      throw new ApiError(403, 'Only assigned agent or admin can update booking status');
    }

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(id)
      .populate('property', 'title price images location')
      .populate('user', 'name email phone avatar')
      .populate('agent', 'name email phone avatar');

    return res
      .status(200)
      .json(new ApiResponse(200, updated, 'Booking status updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'Only the appointment owner can cancel this booking');
    }

    booking.status = 'cancelled';
    await booking.save();

    return res
      .status(200)
      .json(new ApiResponse(200, booking, 'Booking cancelled successfully'));
  } catch (error) {
    next(error);
  }
};
