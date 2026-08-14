import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, CheckCircle, Shield } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  categoryName?: string;
  shortDescription: string;
  image: string;
  priceDisplay?: string;
  availability?: string;
  featured?: boolean;
}

export default function ProductCard({
  name,
  slug,
  categoryName = "Agricultural Equipment",
  shortDescription,
  image,
  priceDisplay = "Price on Request",
  availability = "In Stock",
  featured = false,
}: ProductCardProps) {
  const waUrl = getWhatsAppLink(name);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full group">
      {/* Product Image Header */}
      <div className="relative aspect-16/10 bg-gray-100 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {featured && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-xs flex items-center space-x-1">
            <Shield className="w-3 h-3 fill-slate-950" />
            <span>Featured Machine</span>
          </span>
        )}

        <span className="absolute top-3 right-3 bg-emerald-900/90 text-white font-medium text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs">
          {categoryName}
        </span>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {priceDisplay}
            </span>
            <span className="text-gray-500 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{availability}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${slug}`}
              className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>View Specs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span>Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
