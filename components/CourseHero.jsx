"use client";

import { useState } from "react";

import {
  BookOpen,
  Star,
  Users,
  Target,
  Clock,
  PlayCircle,
  ShieldCheck
} from "lucide-react";

export default function CourseHero({ course }) {

const [progress] = useState(30);

const hero = course.hero;

return (

<section className="pt-32 pb-16 bg-gray-50">

<div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">

{/* LEFT SIDE */}
<div className="lg:col-span-2">

{/* TAGS */}
<div className="flex gap-3 mb-6">

<span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
<Target className="w-4 h-4 text-green-600" />
{hero.tags[0].label}
</span>

<span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
<Clock className="w-4 h-4 text-green-600" />
{hero.tags[1].label}
</span>

<span className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
<PlayCircle className="w-4 h-4 text-purple-600" />
{hero.tags[2].label}
</span>

</div>

{/* TITLE */}
<h1 className="text-4xl font-bold mb-3">
{hero.title}
</h1>

<p className="text-gray-600 text-lg mb-8 max-w-xl">
{hero.subtitle}
</p>

{/* STATS CARDS */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

<div className="bg-white p-5 rounded-xl shadow border text-center">

<div className="text-xl font-bold">
{hero.stats.rating}
</div>

<div className="flex justify-center text-yellow-500 my-1">

<Star size={18} fill="currentColor"/>
<Star size={18} fill="currentColor"/>
<Star size={18} fill="currentColor"/>
<Star size={18} fill="currentColor"/>
<Star size={18} fill="currentColor"/>

</div>

<p className="text-sm font-medium text-gray-600">
Student Rating
</p>

</div>

<div className="bg-white p-5 rounded-xl shadow border text-center">

<div className="text-xl font-bold">
{hero.stats.students}
</div>

<Users className="mx-auto text-green-600 my-1"/>

<p className="text-sm font-medium text-gray-600">
Students Enrolled
</p>

</div>

<div className="bg-white p-5 rounded-xl shadow border text-center">

<div className="text-xl font-bold">
{hero.stats.projects}
</div>

<Target className="mx-auto text-green-600 my-1"/>

<p className="text-sm font-medium text-gray-600">
Projects
</p>

</div>

<div className="bg-white p-5 rounded-xl shadow border text-center">

<div className="text-xl font-bold">
{hero.stats.guarantee}
</div>

<ShieldCheck className="mx-auto text-green-600 my-1"/>

<p className="text-sm font-medium text-gray-600">
Fee Return Guarantee
</p>

</div>

</div>

{/* PROGRESS BAR */}
<div className="bg-white p-6 rounded-xl border shadow">

<div className="flex justify-between mb-2">

<span className="font-semibold">
Course Progress
</span>

<span className="text-green-600 font-bold">
{progress}% Complete
</span>

</div>

<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

<div
className="h-3 bg-green-600 transition-all"
style={{ width: `${progress}%` }}
/>

</div>

</div>

</div>

{/* RIGHT SIDE CARD */}
<div>

<div className="bg-white rounded-2xl mt-16 shadow-lg border overflow-hidden">

<div className="relative">

<img
src={hero.image}
className="w-full h-48 object-cover"
/>

<div className="absolute top-3 right-3 bg-green-700 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
{hero.pricing.discount}
</div>

</div>

<div className="p-6 text-center">

<div className="text-3xl font-bold text-green-600 mb-1">
₹{hero.pricing.discountPrice}
</div>

<div className="text-gray-400 font-semibold line-through mb-5">
₹{hero.pricing.price}
</div>

<button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">

<BookOpen size={18}/>
Enroll Now

</button>

</div>

</div>

</div>

</div>

</section>

);

}