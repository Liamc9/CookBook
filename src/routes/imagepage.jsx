import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export default function ImageGallery() {
    const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const imagesCol = collection(db, 'files'); // 'files' is the name of the collection
      const imageSnapshot = await getDocs(imagesCol);
      const imageList = imageSnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
      setImages(imageList);
      setLoading(false);
    };

    fetchImages();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="max-w-sm rounded overflow-hidden shadow-lg">
              <img src={img.url} alt={img.name || 'Uploaded file'} className="w-full" />
              {img.name && <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{img.name}</div>
              </div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}