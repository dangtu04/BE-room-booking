const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { sendCheckoutEmail } = require("./emailService");

const createReviewService = async (data) => {
  try {
    const { bookingId } = data;
    if (!bookingId) {
      return {
        errCode: 1,
        message: "Missing bookingId",
      };
    }

    const booking = await db.Booking.findOne({
      where: { id: bookingId },
    });
    // không tìm thấy booking
    if (!booking) {
      return { errCode: 2, message: "Booking not found" };
    }

    // kiểm tra checked_out
    if (booking.statusCode !== "CHECKED_OUT") {
      return { errCode: 3, message: "Booking is not CHECKED_OUT" };
    }

    // kiểm tra tồn tại review
    const existing = await db.Review.findOne({ where: { bookingId } });
    if (existing) {
      return {
        errCode: 4,
        message: "Review already created for this booking",
      };
    }

    let property;
    if (booking && booking.propertyId) {
      property = await db.Property.findOne({
        where: { id: booking.propertyId },
      });
    }

    const token = uuidv4();

    await sendCheckoutEmail({
      reciverEmail: booking.userEmail,
      userName: booking.userName,
      propertyName: property?.name,
      redirectLink: buildUrlEmail({
        token: token,
        propertyId: booking.propertyId,
      }),
    });

    const review = await db.Review.create({
      userEmail: booking.userEmail,
      userName: booking.userName,
      propertyId: booking.propertyId,
      bookingId: data.bookingId,
      reviewToken: token,
      rating: null,
      comment: null,
      reviewDate: null,
    });

    return {
      errCode: 0,
      message: "Create review success",
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const buildUrlEmail = (data) => {
  let result = `${process.env.URL_REACT}/review?token=${data.token}&propertyId=${data.propertyId}`;
  return result;
};

const updateReviewService = async (data) => {
  try {
    const { reviewToken, propertyId, rating, comment, reviewDate } = data;

    if (!reviewToken || !propertyId) {
      return {
        errCode: 1,
        message: "Missing reviewToken or propertyId",
      };
    }

    // tìm review theo token + propertyId
    const review = await db.Review.findOne({
      where: { reviewToken, propertyId },
      raw: false,
    });

    if (!review) {
      return {
        errCode: 2,
        message: "Review not found",
      };
    }

    // validate rating (tuỳ bạn set 1-5 hay khác)
    if (rating !== undefined) {
      if (isNaN(rating) || rating < 1 || rating > 10) {
        return {
          errCode: 3,
          message: "Invalid rating (must be 1-10)",
        };
      }
    }

    // update thông tin
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    review.reviewDate = reviewDate;

    await review.save();

    return {
      errCode: 0,
      message: "Update review success",
      data: review,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

const getReviewsByPropertyIdService = async (data) => {
  try {
    const { propertyId } = data;
    if (!propertyId) {
      return {
        errCode: 1,
        message: "Missing parameter",
      };
    }

    const reviews = await db.Review.findAll({
      where: { propertyId },
      attributes: ["userEmail", "userName", "rating", "comment", "reviewDate"],
      include: [
        {
          model: db.Booking,
          as: "booking",
          attributes: ["checkInDate", "checkOutDate", "numPeople"],
          include: [
            {
              model: db.BookingItem,
              as: "bookingItems",
              attributes: ["quantity"],
              include: [
                {
                  model: db.RoomType,
                  as: "roomType",
                  attributes: ["typeCode"],
                  include: [
                    {
                      model: db.Allcode,
                      as: "roomTypeData",
                      attributes: ["keyMap", "valueEn", "valueVi"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      raw: false,
      // nest: true,
    });

    return {
      errCode: 0,
      data: reviews,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      errCode: -1,
      message: "Server error",
    };
  }
};

// const getReviewsByPropertyIdService = async (data) => {
//   try {
//     const { propertyId } = data;
//     if (!propertyId) {
//       return {
//         errCode: 1,
//         message: "Missing parameter",
//       };
//     }

//     const reviews = await db.Review.findAll({
//       where: { propertyId },
//       attributes: ["userEmail", "userName", "rating", "comment", "reviewDate"],
//       include: [
//         {
//           model: db.Booking,
//           as: "booking",
//           attributes: ["checkInDate", "checkOutDate", "numPeople", "numRooms"],
//           include: [
//             {
//               model: db.BookingItem,
//               as: "bookingItems",
//               attributes: ["quantity"],
//               include: [
//                 {
//                   model: db.RoomType,
//                   as: "roomType",
//                   attributes: ["price", "numPeople", "typeCode"],
//                   include: [
//                     {
//                       model: db.Allcode,
//                       as: "roomTypeData",
//                       attributes: ["keyMap", "valueEn", "valueVi"],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//       raw: false,
//       nest: true,
//     });


//     const flatData = reviews.map((review) => {
//       const booking = review.booking || {};
//       const bookingItems = booking.bookingItems || [];

//     
//       if (bookingItems.length > 0) {
//         return bookingItems.map((item) => {
//           const roomType = item.roomType || {};
//           const roomTypeData = roomType.roomTypeData || {};

//           return {
//             userEmail: review.userEmail,
//             userName: review.userName,
//             rating: review.rating,
//             comment: review.comment,
//             reviewDate: review.reviewDate,
//             checkInDate: booking.checkInDate,
//             checkOutDate: booking.checkOutDate,
//             numPeople: booking.numPeople,
//             numRooms: booking.numRooms,
//             quantity: item.quantity,
//             roomPrice: roomType.price,
//             roomCapacity: roomType.numPeople,
//             roomTypeCode: roomType.typeCode,
//             roomTypeKey: roomTypeData.keyMap,
//             roomTypeEn: roomTypeData.valueEn,
//             roomTypeVi: roomTypeData.valueVi,
//           };
//         });
//       } else {
//     
//         return {
//           userEmail: review.userEmail,
//           userName: review.userName,
//           rating: review.rating,
//           comment: review.comment,
//           reviewDate: review.reviewDate,
//           checkInDate: booking.checkInDate,
//           checkOutDate: booking.checkOutDate,
//           numPeople: booking.numPeople,
//           numRooms: booking.numRooms,
//         };
//       }
//     });

//  
//     const result = flatData.flat();

//     return {
//       errCode: 0,
//       data: result,
//     };
//   } catch (error) {
//     console.log("Error: ", error);
//     return {
//       errCode: -1,
//       message: "Server error",
//     };
//   }
// };



module.exports = {
  createReviewService,
  updateReviewService,
  getReviewsByPropertyIdService,
};
