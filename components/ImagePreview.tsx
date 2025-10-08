'use client';

interface ImagePreviewProps {
  imageUrl: string;
  alt: string;
  title?: string;
}

export default function ImagePreview({ imageUrl, alt, title }: ImagePreviewProps) {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
      {title && (
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {title}
          </h3>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
      />
    </div>
  );
}
