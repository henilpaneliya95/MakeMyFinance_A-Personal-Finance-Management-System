// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   Star,
// //   MessageSquare,
// //   ThumbsUp,
// //   Users,
// //   TrendingUp,
// //   RefreshCw,
// //   Send,
// // } from "lucide-react";

// // const userId = localStorage.getItem("userId");

// // const Reviews = () => {
// //   const [rating, setRating] = useState(5);
// //   const [hoverRating, setHoverRating] = useState(0);
// //   const [review, setReview] = useState("");
// //   const [reviews, setReviews] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [submitting, setSubmitting] = useState(false);

// //   // Fetch reviews from backend
// //   const fetchReviews = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await axios.get("http://localhost:8000/api/review/");
// //       setReviews(res.data.reverse()); // latest first
// //     } catch (err) {
// //       console.error("Failed to fetch reviews:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchReviews();
// //   }, []);

// //   const handleSubmit = async () => {
// //     if (!review.trim() && rating === 0) return;

// //     setSubmitting(true);
// //     try {
// //       const payload = {
// //         user_id: userId,
// //         rating,
// //         comment: review,
// //       };

// //       await axios.post("http://localhost:8000/api/review/", payload);

// //       // Success animation
// //       const successDiv = document.createElement("div");
// //       successDiv.className =
// //         "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right";
// //       successDiv.innerHTML = `
// //         <div class="flex items-center space-x-2">
// //           <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
// //           </svg>
// //           <span>Review submitted successfully!</span>
// //         </div>
// //       `;
// //       document.body.appendChild(successDiv);
// //       setTimeout(() => document.body.removeChild(successDiv), 3000);

// //       setReview("");
// //       setRating(5);
// //       await fetchReviews();
// //     } catch (err) {
// //       console.error("Failed to submit review:", err);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   //   const deleteReview = async (reviewId) => {
// //   //   try {
// //   //     const token = localStorage.getItem("accessToken");
// //   //     await axios.delete(`http://localhost:8000/api/review/${reviewId}/`, {
// //   //       headers: {
// //   //         Authorization: `Bearer ${token}`,
// //   //       },
// //   //     });
// //   //     alert("Review deleted successfully!");
// //   //     // Optionally: refresh the review list
// //   //   } catch (error) {
// //   //     console.error("Error deleting review:", error);
// //   //     alert("Failed to delete review");
// //   //   }
// //   // };

// //   const renderStars = (value, interactive = false, size = "w-5 h-5") => {
// //     return Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
// //       <Star
// //         key={star}
// //         className={`${size} ${
// //           star <= value ? "text-yellow-400" : "text-gray-300"
// //         } ${
// //           interactive
// //             ? "cursor-pointer transition-colors hover:text-yellow-400"
// //             : ""
// //         }`}
// //         fill={star <= value ? "currentColor" : "none"}
// //         onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
// //         onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
// //         onClick={interactive ? () => setRating(star) : undefined}
// //       />
// //     ));
// //   };

// //   const averageRating =
// //     reviews.length > 0
// //       ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
// //       : 0;
// //   const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
// //     rating,
// //     count: reviews.filter((r) => r.rating === rating).length,
// //     percentage:
// //       reviews.length > 0
// //         ? (reviews.filter((r) => r.rating === rating).length / reviews.length) *
// //           100
// //         : 0,
// //   }));

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //             Reviews & Feedback
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             Share your experience and read what others are saying about
// //             this platform
// //           </p>
// //         </div>
// //         <div className="flex items-center space-x-3">
// //           <Button variant="outline" onClick={fetchReviews}>
// //             <RefreshCw className="w-4 h-4 mr-2" />
// //             Refresh
// //           </Button>
// //           <Badge variant="secondary" className="px-3 py-1">
// //             <MessageSquare className="w-4 h-4 mr-1" />
// //             {reviews.length} Reviews
// //           </Badge>
// //         </div>
// //       </div>

// //       {/* Overview Stats */}
// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   Average Rating
// //                 </p>
// //                 <p className="text-2xl font-bold text-yellow-600">
// //                   {averageRating.toFixed(1)}
// //                 </p>
// //                 <div className="flex items-center mt-1">
// //                   {renderStars(Math.round(averageRating))}
// //                 </div>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
// //                 <Star className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   Total Reviews
// //                 </p>
// //                 <p className="text-2xl font-bold text-blue-600">
// //                   {reviews.length}
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">User feedback</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
// //                 <MessageSquare className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   Positive Reviews
// //                 </p>
// //                 <p className="text-2xl font-bold text-green-600">
// //                   {reviews.filter((r) => r.rating >= 4).length}
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">4+ star ratings</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
// //                 <ThumbsUp className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-500 font-medium">
// //                   Satisfaction Rate
// //                 </p>
// //                 <p className="text-2xl font-bold text-purple-600">
// //                   {reviews.length > 0
// //                     ? (
// //                         (reviews.filter((r) => r.rating >= 4).length /
// //                           reviews.length) *
// //                         100
// //                       ).toFixed(0)
// //                     : 0}
// //                   %
// //                 </p>
// //                 <p className="text-sm text-gray-500 mt-1">Happy users</p>
// //               </div>
// //               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
// //                 <TrendingUp className="w-6 h-6 text-white" />
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //         {/* Submit Review */}
// //         <Card className="lg:col-span-1 border-0 shadow-lg">
// //           <CardHeader>
// //             <CardTitle className="flex items-center text-xl font-semibold">
// //               <Star className="w-5 h-5 mr-2 text-blue-600" />
// //               Share Your Experience
// //             </CardTitle>
// //             <p className="text-gray-600">
// //               Help others by sharing your experience with this platform
// //             </p>
// //           </CardHeader>
// //           <CardContent className="space-y-6">
// //             <div>
// //               <p className="text-gray-700 mb-3 font-medium">Your Rating:</p>
// //               <div className="flex gap-1 mb-2">
// //                 {renderStars(hoverRating || rating, true, "w-8 h-8")}
// //               </div>
// //               <p className="text-sm text-gray-500">
// //                 {rating === 5 && "Excellent! 🌟"}
// //                 {rating === 4 && "Very Good! 👍"}
// //                 {rating === 3 && "Good 👌"}
// //                 {rating === 2 && "Fair 😐"}
// //                 {rating === 1 && "Poor 👎"}
// //               </p>
// //             </div>

// //             <div>
// //               <p className="text-gray-700 mb-3 font-medium">
// //                 Your Review (Optional):
// //               </p>
// //               <Textarea
// //                 placeholder="Tell us about your experience with this platform..."
// //                 maxLength={500}
// //                 value={review}
// //                 onChange={(e) => setReview(e.target.value)}
// //                 className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
// //               />
// //               <p className="text-sm text-right text-gray-500 mt-2">
// //                 {review.length}/500 characters
// //               </p>
// //             </div>

// //             <Button
// //               onClick={handleSubmit}
// //               disabled={submitting}
// //               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //             >
// //               {submitting ? (
// //                 <div className="flex items-center space-x-2">
// //                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// //                   <span>Submitting...</span>
// //                 </div>
// //               ) : (
// //                 <>
// //                   <Send className="w-4 h-4 mr-2" />
// //                   Submit Review
// //                 </>
// //               )}
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         {/* Rating Distribution & Reviews List */}
// //         <div className="lg:col-span-2 space-y-6">
// //           {/* Rating Distribution */}
// //           <Card className="border-0 shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="text-xl font-semibold">
// //                 Rating Distribution
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-3">
// //                 {ratingDistribution.map(({ rating, count, percentage }) => (
// //                   <div key={rating} className="flex items-center space-x-3">
// //                     <div className="flex items-center space-x-1 w-16">
// //                       <span className="text-sm font-medium">{rating}</span>
// //                       <Star
// //                         className="w-4 h-4 text-yellow-400"
// //                         fill="currentColor"
// //                       />
// //                     </div>
// //                     <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
// //                       <div
// //                         className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
// //                         style={{ width: `${percentage}%` }}
// //                       />
// //                     </div>
// //                     <span className="text-sm text-gray-600 w-12">{count}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Reviews List */}
// //           <Card className="border-0 shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="flex items-center text-xl font-semibold">
// //                 <Users className="w-5 h-5 mr-2 text-blue-600" />
// //                 User Reviews ({reviews.length})
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {loading ? (
// //                 <div className="text-center py-8">
// //                   <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //                   <p className="text-gray-600">Loading reviews...</p>
// //                 </div>
// //               ) : reviews.length === 0 ? (
// //                 <div className="text-center py-12">
// //                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //                     <MessageSquare className="w-8 h-8 text-gray-400" />
// //                   </div>
// //                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                     No Reviews Yet
// //                   </h3>
// //                   <p className="text-gray-600">
// //                     Be the first to share your experience!
// //                   </p>
// //                 </div>
// //               ) : (
// //                 <div className="space-y-6">
// //                   {reviews.map((r, idx) => (
// //                     <div
// //                       key={idx}
// //                       className="animate-fade-in-up"
// //                       style={{ animationDelay: `${idx * 100}ms` }}
// //                     >
// //                       <div className="flex items-start space-x-4">
// //                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
// //                           <span className="text-white font-semibold text-sm">
// //                             {(r.username || "User").charAt(0).toUpperCase()}
// //                           </span>
// //                         </div>
// //                         <div className="flex-1">
// //                           <div className="flex items-center justify-between mb-2">
// //                             <div>
// //                               <p className="font-semibold text-gray-900">
// //                                 {r.username || "Anonymous User"}
// //                               </p>
// //                               <div className="flex items-center space-x-2">
// //                                 <div className="flex">
// //                                   {renderStars(r.rating)}
// //                                 </div>
// //                                 <span className="text-sm text-gray-500">
// //                                   {new Date(r.submitted_at).toLocaleDateString(
// //                                     "en-US",
// //                                     {
// //                                       day: "numeric",
// //                                       month: "short",
// //                                       year: "numeric",
// //                                     }
// //                                   )}
// //                                 </span>
// //                               </div>
// //                             </div>
// //                           </div>
// //                           {r.comment && (
// //                             <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
// //                               {r.comment}
// //                             </p>
// //                           )}
// //                           {/* <button
// //                               className="text-red-600 font-semibold"
// //                               onClick={() => deleteReview(r._id)}
// //                             >
// //                               Delete
// //                             </button> */}
// //                         </div>
// //                       </div>
// //                       {idx < reviews.length - 1 && (
// //                         <Separator className="mt-6" />
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Reviews;




// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Star, MessageSquare, ThumbsUp, Users, TrendingUp, RefreshCw, Send } from "lucide-react"

// const userId = localStorage.getItem("userId")

// const Reviews = () => {
//   const [rating, setRating] = useState(5)
//   const [hoverRating, setHoverRating] = useState(0)
//   const [review, setReview] = useState("")
//   const [reviews, setReviews] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)

//   // Fetch reviews from backend
//   const fetchReviews = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get("http://localhost:8000/api/review/")
//       setReviews(res.data.reverse()) // latest first
//     } catch (err) {
//       console.error("Failed to fetch reviews:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchReviews()
//   }, [])

//   const handleSubmit = async () => {
//     if (!review.trim() && rating === 0) return

//     setSubmitting(true)
//     try {
//       const payload = {
//         user_id: userId,
//         rating,
//         comment: review,
//       }

//       await axios.post("http://localhost:8000/api/review/", payload)

//       // Success animation
//       const successDiv = document.createElement("div")
//       successDiv.className =
//         "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right"
//       successDiv.innerHTML = `
//         <div class="flex items-center space-x-2">
//           <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
//           </svg>
//           <span>Review submitted successfully!</span>
//         </div>
//       `
//       document.body.appendChild(successDiv)
//       setTimeout(() => document.body.removeChild(successDiv), 3000)

//       setReview("")
//       setRating(5)
//       await fetchReviews()
//     } catch (err) {
//       console.error("Failed to submit review:", err)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   //   const deleteReview = async (reviewId) => {
//   //   try {
//   //     const token = localStorage.getItem("accessToken");
//   //     await axios.delete(`http://localhost:8000/api/review/${reviewId}/`, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     });
//   //     alert("Review deleted successfully!");
//   //     // Optionally: refresh the review list
//   //   } catch (error) {
//   //     console.error("Error deleting review:", error);
//   //     alert("Failed to delete review");
//   //   }
//   // };

//   const renderStars = (value, interactive = false, size = "w-5 h-5") => {
//     return Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
//       <Star
//         key={star}
//         className={`${size} ${star <= value ? "text-yellow-400" : "text-gray-300"} ${
//           interactive ? "cursor-pointer transition-colors hover:text-yellow-400" : ""
//         }`}
//         fill={star <= value ? "currentColor" : "none"}
//         onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
//         onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
//         onClick={interactive ? () => setRating(star) : undefined}
//       />
//     ))
//   }

//   const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
//   const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
//     rating,
//     count: reviews.filter((r) => r.rating === rating).length,
//     percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
//   }))

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Reviews & Feedback
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Share your experience and read what others are saying about this platform
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button variant="outline" onClick={fetchReviews}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Badge variant="secondary" className="px-3 py-1">
//             <MessageSquare className="w-4 h-4 mr-1" />
//             {reviews.length} Reviews
//           </Badge>
//         </div>
//       </div>

//       {/* Overview Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Average Rating</p>
//                 <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
//                 <div className="flex items-center mt-1">{renderStars(Math.round(averageRating))}</div>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
//                 <Star className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
//                 <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
//                 <p className="text-sm text-gray-500 mt-1">User feedback</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                 <MessageSquare className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Positive Reviews</p>
//                 <p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.rating >= 4).length}</p>
//                 <p className="text-sm text-gray-500 mt-1">4+ star ratings</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
//                 <ThumbsUp className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Satisfaction Rate</p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   {reviews.length > 0
//                     ? ((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100).toFixed(0)
//                     : 0}
//                   %
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Happy users</p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Submit Review */}
//         <Card className="lg:col-span-1 border-0 shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center text-xl font-semibold">
//               <Star className="w-5 h-5 mr-2 text-blue-600" />
//               Share Your Experience
//             </CardTitle>
//             <p className="text-gray-600">Help others by sharing your experience with this platform</p>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <p className="text-gray-700 mb-3 font-medium">Your Rating:</p>
//               <div className="flex gap-1 mb-2">{renderStars(hoverRating || rating, true, "w-8 h-8")}</div>
//               <p className="text-sm text-gray-500">
//                 {rating === 5 && "Excellent! 🌟"}
//                 {rating === 4 && "Very Good! 👍"}
//                 {rating === 3 && "Good 👌"}
//                 {rating === 2 && "Fair 😐"}
//                 {rating === 1 && "Poor 👎"}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-700 mb-3 font-medium">Your Review (Optional):</p>
//               <Textarea
//                 placeholder="Tell us about your experience with this platform..."
//                 maxLength={500}
//                 value={review}
//                 onChange={(e) => setReview(e.target.value)}
//                 className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//               />
//               <p className="text-sm text-right text-gray-500 mt-2">{review.length}/500 characters</p>
//             </div>

//             <Button
//               onClick={handleSubmit}
//               disabled={submitting}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//             >
//               {submitting ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Submitting...</span>
//                 </div>
//               ) : (
//                 <>
//                   <Send className="w-4 h-4 mr-2" />
//                   Submit Review
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Rating Distribution & Reviews List */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Rating Distribution */}
//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-xl font-semibold">Rating Distribution</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {ratingDistribution.map(({ rating, count, percentage }) => (
//                   <div key={rating} className="flex items-center space-x-3">
//                     <div className="flex items-center space-x-1 w-16">
//                       <span className="text-sm font-medium">{rating}</span>
//                       <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
//                     </div>
//                     <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
//                       <div
//                         className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
//                         style={{ width: `${percentage}%` }}
//                       />
//                     </div>
//                     <span className="text-sm text-gray-600 w-12">{count}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Reviews List */}
//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center text-xl font-semibold">
//                 <Users className="w-5 h-5 mr-2 text-blue-600" />
//                 User Reviews ({reviews.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div className="text-center py-8">
//                   <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                   <p className="text-gray-600">Loading reviews...</p>
//                 </div>
//               ) : reviews.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <MessageSquare className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
//                   <p className="text-gray-600">Be the first to share your experience!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {reviews.map((r, idx) => (
//                     <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
//                       <div className="flex items-start space-x-4">
//                         <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                           <span className="text-white font-semibold text-sm">
//                             {(r.username || "User").charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between mb-2">
//                             <div>
//                               <p className="font-semibold text-gray-900">{r.username || "Anonymous User"}</p>
//                               <div className="flex items-center space-x-2">
//                                 <div className="flex">{renderStars(r.rating)}</div>
//                                 <span className="text-sm text-gray-500">
//                                   {new Date(r.submitted_at).toLocaleDateString("en-US", {
//                                     day: "numeric",
//                                     month: "short",
//                                     year: "numeric",
//                                   })}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           {r.comment && <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{r.comment}</p>}
//                           {/* <button
//                               className="text-red-600 font-semibold"
//                               onClick={() => deleteReview(r._id)}
//                             >
//                               Delete
//                             </button> */}
//                         </div>
//                       </div>
//                       {idx < reviews.length - 1 && <Separator className="mt-6" />}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Reviews


"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MessageSquare, ThumbsUp, Users, TrendingUp, RefreshCw, Send } from "lucide-react"
import { API_BASE } from "@/lib/api"

const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

const Reviews = () => {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState("")
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/review/`)
      setReviews(res.data.reverse())
    } catch (err) {
      console.error("Failed to fetch reviews:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleSubmit = async () => {
    if (!review.trim() && rating === 0) return

    setSubmitting(true)
    try {
      const payload = {
        user_id: userId,
        rating,
        comment: review,
      }

      await axios.post(`${API_BASE}/review/`, payload)

      const successDiv = document.createElement("div")
      successDiv.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right"
      successDiv.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span>Review submitted successfully!</span>
        </div>
      `
      document.body.appendChild(successDiv)
      setTimeout(() => document.body.removeChild(successDiv), 3000)

      setReview("")
      setRating(5)
      await fetchReviews()
    } catch (err) {
      console.error("Failed to submit review:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (value, interactive = false, size = "w-5 h-5") => {
    return Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
      <Star
        key={star}
        className={`${size} ${star <= value ? "text-yellow-400" : "text-gray-300"} ${
          interactive ? "cursor-pointer transition-colors hover:text-yellow-400" : ""
        }`}
        fill={star <= value ? "currentColor" : "none"}
        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        onClick={interactive ? () => setRating(star) : undefined}
      />
    ))
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
  }))

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reviews & Feedback
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Share your experience and read what others are saying about this platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <Button variant="outline" onClick={fetchReviews} className="w-full sm:w-auto bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Badge variant="secondary" className="px-3 py-1">
            <MessageSquare className="w-4 h-4 mr-1" />
            {reviews.length} Reviews
          </Badge>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Average Rating</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-1">{renderStars(Math.round(averageRating))}</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{reviews.length}</p>
                <p className="text-sm text-gray-500 mt-1">User feedback</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Positive Reviews</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {reviews.filter((r) => r.rating >= 4).length}
                </p>
                <p className="text-sm text-gray-500 mt-1">4+ star ratings</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Satisfaction Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {reviews.length > 0
                    ? ((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100).toFixed(0)
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-500 mt-1">Happy users</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Submit Review */}
        <Card className="lg:col-span-1 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
              <Star className="w-5 h-5 mr-2 text-blue-600" />
              Share Your Experience
            </CardTitle>
            <p className="text-gray-600 text-sm sm:text-base">
              Help others by sharing your experience with this platform
            </p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-gray-700 mb-3 font-medium">Your Rating:</p>
              <div className="flex gap-1 mb-2 justify-center sm:justify-start">
                {renderStars(hoverRating || rating, true, "w-6 h-6 sm:w-8 sm:h-8")}
              </div>
              <p className="text-sm text-gray-500 text-center sm:text-left">
                {rating === 5 && "Excellent! 🌟"}
                {rating === 4 && "Very Good! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Poor 👎"}
              </p>
            </div>

            <div>
              <p className="text-gray-700 mb-3 font-medium">Your Review (Optional):</p>
              <Textarea
                placeholder="Tell us about your experience with this platform..."
                maxLength={500}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px] sm:min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-right text-gray-500 mt-2">{review.length}/500 characters</p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Rating Distribution & Reviews List */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Rating Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12 sm:w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    </div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 sm:w-12">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                User Reviews ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {reviews.map((r, idx) => (
                    <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {(r.username || "User").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                {r.username || "Anonymous User"}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex">{renderStars(r.rating)}</div>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {new Date(r.submitted_at).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          {r.comment && (
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm sm:text-base break-words">
                              {r.comment}
                            </p>
                          )}
                        </div>
                      </div>
                      {idx < reviews.length - 1 && <Separator className="mt-4 sm:mt-6" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Reviews
