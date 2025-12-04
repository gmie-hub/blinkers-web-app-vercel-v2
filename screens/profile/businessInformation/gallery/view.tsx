import React from 'react';
import styles from './styles.module.scss';

interface GalleryViewProps {
  businessDetailsData?: AllBusinessesDatum;
  type: 'images' | 'videos';
  onClose: () => void; // Function to close the gallery view
}

const GalleryView: React.FC<GalleryViewProps> = ({ businessDetailsData, type,onClose }) => {
  // Function to check if the file is an image
  const isImage = (url: string) => /\.(jpg|jpeg|png|svg|gif)$/i.test(url);

  // Function to check if the file is a video
  const isVideo = (url: string) => /\.(mp4|avi|mov|wmv|webm)$/i.test(url);

  const galleryItems = businessDetailsData?.gallery?.filter((item: gallery) => 
    type === 'images' ? isImage(item?.url) : isVideo(item?.url)
  );

  return (
    <div className={styles.fullGallery}>
      <h1 onClick={onClose} className={styles.closeButton}>{'< Back'}</h1>
    
   
        <p className={'line'} >
        {type === 'images' ? 'Images' : 'Videos'}
      </p>
      
      <br />
      {galleryItems && galleryItems.length > 0 ? (
        <div className={styles.img_wrapper}>
          {galleryItems?.map((item: gallery, index: number) => (
            type === 'images' ? (
              <div key={index} className={styles.imageContainer}>
                <img src={item?.url} alt={`myimg ${index + 1}`} />
              </div>
            ) : (
              <video key={index} controls playsInline poster={item?.url} className={styles.videoElement}>
                <source src={item?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          ))}
        </div>
      ) : (
        <div>
          <p>No available {type === 'images' ? 'images' : 'videos'}</p>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
