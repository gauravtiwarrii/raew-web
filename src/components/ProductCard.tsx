"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/[0.08] transition-shadow duration-300 flex flex-col h-full group"
    >
      {/* Product Image Header */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {featured && (
          <span className="absolute top-3 left-3 shimmer-badge text-[var(--charcoal-900)] font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg shadow-md flex items-center space-x-1.5">
            <Shield className="w-3 h-3 fill-[var(--charcoal-900)]" />
            <span>Featured Machine</span>
          </span>
        )}

        <span className="absolute top-3 right-3 glass text-white font-medium text-[11px] px-3 py-1.5 rounded-lg">
          {categoryName}
        </span>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-[var(--charcoal-900)] group-hover:text-[var(--gold-600)] transition-colors duration-200 line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--gold-700)] bg-[var(--gold-50)] px-3 py-1.5 rounded-lg border border-[var(--gold-200)]">
              {priceDisplay}
            </span>
            <span className="text-gray-400 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--forest-600)]" />
              <span>{availability}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${slug}`}
              className="w-full inline-flex items-center justify-center py-2.5 px-3 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 border border-gray-200"
            >
              <span>View Specs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-[var(--forest-700)] to-[var(--forest-600)] hover:from-[var(--forest-600)] hover:to-[var(--forest-500)] rounded-xl transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              <span>Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
