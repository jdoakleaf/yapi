import { getTestimonials } from "@/lib/cms/content-actions";
import { TestimonialList } from "./testimonial-list";


export default async function YorumlarPage() {
  const testimonials = await getTestimonials();
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Müşteri Yorumları</h1>
        <p className="mt-1 text-sm text-gray-500">{testimonials.length} yorum</p>
      </div>
      <TestimonialList testimonials={testimonials} />
    </div>
  );
}
