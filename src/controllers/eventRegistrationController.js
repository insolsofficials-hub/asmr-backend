import EventRegistration from "../models/EventRegistration.js";
import { unlink } from 'node:fs/promises';

const duplicateMessage = 'You have already submitted an event registration.';

async function removeRejectedUploads(files) {
  const paths = Object.values(files || {}).flat().map(file => file.path).filter(Boolean);
  await Promise.allSettled(paths.map(path => unlink(path)));
}

export async function createEventRegistration(req, res, next) {
  try {
    if (!req.files?.profilePicture?.[0]) {
      await removeRejectedUploads(req.files);
      return res
        .status(400)
        .json({
          success: false,
          message: "A profile picture is required.",
        });
    }
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''; 
    if (await EventRegistration.exists({ email }).collation({ locale: 'en', strength: 2 })) {
      await removeRejectedUploads(req.files);
      return res.status(409).json({ success: false, message: duplicateMessage, errors: { email: 'This email address has already been used for an application.' } });
    }
    const registration = await EventRegistration.create({
      ...Object.fromEntries(['fullName', 'designation', 'institution', 'country', 'gender', 'phone', 'address'].map(key => [key, req.body[key]])),
      email,

      profilePicture: `uploads/profiles/${req.files.profilePicture[0].filename}`,
      cv: req.files.cv?.[0] ? `uploads/cvs/${req.files.cv[0].filename}` : undefined,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Event registration submitted successfully.",
        data: { id: registration.id, status: registration.status },
      });
  } catch (error) {
    await removeRejectedUploads(req.files);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: duplicateMessage, errors: { email: 'This email address has already been used for an application.' } });
    }
    next(error);
  }
}

export async function getMyEventRegistration(req, res, next) {
  try {
    const registration = await EventRegistration.findOne({ user: req.user._id }).lean();
    res.json({ success: true, data: registration });
  } catch (error) { next(error); }
}
