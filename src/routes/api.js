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
const { createProperty, getAllProperties, getPropertyById, editProperty, getPropertiesByProvince } = require("../controllers/propertyController");
const { uploadSingle, uploadMultiple } = require("../middleware/upload");
const { bulkAddImages, deleteImage, updateImage, getImageByTargetId, addSingleImage, deleteImageByTargetId } = require("../controllers/uploadController");
const { createRoomType, getListRoomTypeByPropertyId, updateRoomType, deleteRoomType } = require("../controllers/roomTypeController");
const { createRoomUnit, getListRoomUnitByRoomTypeId } = require("../controllers/roomUnitController");
const { searchController, saerchPropertiesByProvince, getSuitableRoomTypes } = require("../controllers/searchController");
const { createBooking } = require("../controllers/bookingController");
const { createRoomAmenity } = require("../controllers/roomAmenityController");




const initApiRoutes = (app) => {
  router.use(auth);

  router.get("/", (req, res) => {
    return res.status(200).json("hello word");
  });

  // user
  router.post("/login", userLogin);
  router.post("/register", handleCreateUser);

  router.get("/get-all-users", authorizeRole(["R1"]), handleGetAllUser);
  router.get("/get-all-owners", authorizeRole(["R1"]), handleGetAllOwner);
  router.get("/get-user-by-id", authorizeRole(["R1", "R2", "R3"]), handleGetUserById);
  router.put("/edit-user", authorizeRole(["R1", "R2", "R3"]), handleEditUser);
  router.delete("/delete-user", authorizeRole(["R1"]), handleDeleteUser);

  // allcode
  router.get("/get-allcode", authorizeRole(["R1", "R2", "R3"]), handleGetAllCode);
  router.get("/get-listprovince-allcode", authorizeRole(["R1", "R2", "R3"]), getListProvince);

  // property
  router.post("/create-property", uploadSingle, authorizeRole(["R1"]), createProperty);
  router.get("/get-all-properties", authorizeRole(["R1", "R2", "R3"]), getAllProperties);
  router.get("/get-property-by-id", authorizeRole(["R1", "R2", "R3"]), getPropertyById);
  router.put("/edit-property", uploadSingle, authorizeRole(["R1", "R2"]), editProperty);
  router.get("/get-properties-by-province", authorizeRole(["R1", "R2", "R3"]), getPropertiesByProvince);

  // roomType
  router.post("/create-roomtype", authorizeRole(["R1", "R2"]), createRoomType);
  router.get("/get-list-roomtype-by-propertyid", authorizeRole(["R1", "R2"]), getListRoomTypeByPropertyId);
  router.put("/update-roomtype", authorizeRole(["R1", "R2"]), updateRoomType);
  router.delete("/delete-roomtype", authorizeRole(["R1", "R2"]), deleteRoomType);

  // roomUnit
  router.post("/create-roomunit", authorizeRole(["R1", "R2"]), createRoomUnit);
  router.get("/get-list-roomunit-by-roomtypeid", authorizeRole(["R1", "R2"]), getListRoomUnitByRoomTypeId);


  
  // images
  router.post("/bulk-add-images", uploadMultiple, authorizeRole(["R1", "R2"]), bulkAddImages);
  router.post("/single-add-image", uploadMultiple, authorizeRole(["R1", "R2"]), addSingleImage);
  router.post("/delete-image-by-public-id", authorizeRole(["R1", "R2"]), deleteImage);
  router.put("/update-image", authorizeRole(["R1", "R2"]), updateImage);
  router.get("/get-image-by-target-id", authorizeRole(["R1", "R2", "R3"]), getImageByTargetId);
  router.delete("/delete-image-by-target-id", authorizeRole(["R1", "R2"]), deleteImageByTargetId);

  // search
  router.post("/search", authorizeRole(["R1", "R2", "R3"]), searchController);
  router.get("/search-properties-by-province", authorizeRole(["R1", "R2", "R3"]), saerchPropertiesByProvince);
  router.get("/get-suitable-roomtypes", authorizeRole(["R1", "R2", "R3"]), getSuitableRoomTypes);

  //  booking
  router.post("/create-booking", authorizeRole(["R1", "R2", "R3"]), createBooking);


  // roomAmenity
  router.post("/create-room-amenity", authorizeRole(["R1", "R2"]), createRoomAmenity);
  
  router.get("/get-out-standing-location", authorizeRole(["R1", "R2", "R3"]), getOutstandingLocation);

  return app.use("/v1/api/", router);
};


module.exports = initApiRoutes;
