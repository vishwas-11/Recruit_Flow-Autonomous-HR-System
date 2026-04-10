// "use client";

// import { useEffect, useState } from "react";
// import API from "@/services/api";
// import { getToken } from "@/utils/auth";

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// const times = ["10AM", "11AM", "12PM", "1PM", "2PM", "3PM"];

// export default function CalendarPage() {
//   const [booked, setBooked] = useState({});

//   //  FETCH FROM BACKEND
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await API.get("/calendar", {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         });

//         const map = {};
//         res.data.forEach((e) => {
//           const key = `${e.date}-${e.time}`;
//           map[key] = true;
//         });

//         setBooked(map);
//       } catch (err) {
//         console.error("Failed to fetch events", err);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div className="h-screen bg-gray-900 text-white p-10">
//       <h1 className="text-2xl mb-6 font-bold">Interview Scheduler</h1>

//       <div className="grid grid-cols-7 gap-4">
//         <div></div>

//         {/* Time headers */}
//         {times.map((time) => (
//           <div key={time} className="text-center font-bold">
//             {time}
//           </div>
//         ))}

//         {/* Rows */}
//         {days.map((day) => (
//           <div key={day} className="contents">
//             {/* Day label */}
//             <div className="font-bold">{day}</div>

//             {times.map((time) => {
//               const key = `${day.toLowerCase()}-${time.toLowerCase()}`;
//               const isBooked = booked[key];

//               return (
//                 <div
//                   key={key}
//                   className={`p-4 text-center rounded ${
//                     isBooked
//                       ? "bg-red-600"
//                       : "bg-gray-700 hover:bg-blue-500"
//                   }`}
//                 >
//                   {isBooked ? "Booked" : "Available"}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }







import { redirect } from "next/navigation";

export default function CalendarPage() {
  redirect("/chat");
}