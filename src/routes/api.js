const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  userLogin,
  handleGetAllUser,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  handleGetUserById,
  handleGetAllOwner,
} = require("../controllers/userController");
const authorizeRole = require("../middleware/authorizeRole");
const { handleGetAllCode, getListProvince, getOutstandingLocation } = require("../controllers/allcodeController");
const { createProperty, getAllProperties, getPropertyById, editProperty, getPropertiesByProvince, getImagesProperty } = require("../controllers/propertyController");
const { uploadSingle, uploadMultiple } = require("../middleware/upload");
const { bulkAddImages, deleteImage, updateImage, getImageByTargetId, addSingleImage, deleteImageByTargetId, deleteImageById } = require("../controllers/uploadController");
const { createRoomType, getListRoomTypeByPropertyId, updateRoomType, deleteRoomType } = require("../controllers/roomTypeController");
const { createRoomUnit, getListRoomUnitByRoomTypeId } = require("../controllers/roomUnitController");
const { searchController, saerchPropertiesByProvince, getSuitableRoomTypes } = require("../controllers/searchController");
const { createBooking, verifyBooking, getBookingList, changeBookingStatus, getOwnerRevenue, getAdminRevenue } = require("../controllers/bookingController");
const { createRoomAmenity } = require("../controllers/roomAmenityController");
const { savePropertyAmenity, getPropertyAmenitiesByPropertyId } = require("../controllers/propertyAmenityController");
const { createReview, updateReview, getReviewsByPropertyId } = require("../controllers/reviewController");
const { upsertAbout, getAbout } = require("../controllers/aboutController");
const { createContact, getAllContacts, deleteContact } = require("../controllers/contactController");
const { USER_ROLE } = require("../utils");





const initApiRoutes = (app) => {
  router.use(auth);

  router.get("/", (req, res) => {
    return res.status(200).json("hello word");
  });

  // user
  router.post("/login", userLogin);
  router.post("/register", handleCreateUser);

  router.get("/get-all-users", authorizeRole([USER_ROLE.ADMIN]), handleGetAllUser);
  
  router.get("/get-all-owners", authorizeRole([USER_ROLE.ADMIN]), handleGetAllOwner);
  router.get("/get-user-by-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), handleGetUserById);
  router.put("/edit-user", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), handleEditUser);
  router.delete("/delete-user", authorizeRole([USER_ROLE.ADMIN]), handleDeleteUser);

  // allcode
  router.get("/get-allcode", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), handleGetAllCode);
  router.get("/get-listprovince-allcode", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getListProvince);

  // property
  router.post("/create-property", uploadSingle, authorizeRole([USER_ROLE.ADMIN]), createProperty);
  router.get("/get-all-properties", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getAllProperties);
  router.get("/get-property-by-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getPropertyById);
  router.put("/edit-property", uploadSingle, authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), editProperty);
  router.get("/get-properties-by-province", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getPropertiesByProvince);
  router.get("/get-images-property", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getImagesProperty);

  // roomType
  router.post("/create-roomtype", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), createRoomType);
  router.get("/get-list-roomtype-by-propertyid", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), getListRoomTypeByPropertyId);
  router.put("/update-roomtype", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), updateRoomType);
  router.delete("/delete-roomtype", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), deleteRoomType);

  // roomUnit
  router.post("/create-roomunit", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), createRoomUnit);
  router.get("/get-list-roomunit-by-roomtypeid", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), getListRoomUnitByRoomTypeId);


  
  // images
  router.post("/bulk-add-images", uploadMultiple, authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), bulkAddImages);
  router.post("/single-add-image", uploadMultiple, authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), addSingleImage);
  router.post("/delete-image-by-public-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), deleteImage);
  router.put("/update-image", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), updateImage);
  router.get("/get-image-by-target-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getImageByTargetId);
  router.delete("/delete-image-by-target-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), deleteImageByTargetId);
  router.delete("/delete-image-by-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), deleteImageById);

  // search
  router.post("/search", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), searchController);
  router.get("/search-properties-by-province", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), saerchPropertiesByProvince);
  router.get("/get-suitable-roomtypes", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getSuitableRoomTypes);

  //  booking
  router.post("/create-booking", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), createBooking);
  router.post("/verify-booking", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), verifyBooking);
  router.get("/get-booking-list", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getBookingList);
  router.put("/change-booking-status", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), changeBookingStatus);

  router.get("/get-owner-revenue", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), getOwnerRevenue);
  router.get("/get-admin-revenue", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), getAdminRevenue);

  // roomAmenity
  router.post("/create-room-amenity", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), createRoomAmenity);

  // propertyAmenity
  router.post("/save-property-amenity", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), savePropertyAmenity);
  router.get("/get-property-amenity-by-property-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER]), getPropertyAmenitiesByPropertyId);


  // review
  router.post("/create-review", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), createReview);
  router.put("/update-review", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), updateReview);
  router.get("/get-reviews-by-property-id", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getReviewsByPropertyId);

  // about
  router.post("/upsert-about", authorizeRole([USER_ROLE.ADMIN]), upsertAbout);
  router.get("/get-about", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getAbout);

  // contact
  router.post("/create-contact", createContact);
  router.get("/get-contacts", authorizeRole([USER_ROLE.ADMIN]), getAllContacts);
  router.delete("/delete-contact", authorizeRole([USER_ROLE.ADMIN]), deleteContact);


  router.get("/get-out-standing-location", authorizeRole([USER_ROLE.ADMIN, USER_ROLE.OWNER, USER_ROLE.USER]), getOutstandingLocation);

  return app.use("/v1/api/", router);
};


module.exports = initApiRoutes;
