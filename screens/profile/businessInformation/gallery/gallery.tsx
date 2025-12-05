import Card from "../../../../customs/card/card";
import styles from './styles.module.scss';
import { useState } from 'react';
import GalleryView from './view'; // Import the new component
import Right from "../../../../assets/arrow-right-green.svg";

interface GalleryProps {
  businessDetailsData?: AllBusinessesDatum;
}

export default function Gallery({ businessDetailsData }: GalleryProps) {
  const [view, setView] = useState<'images' | 'videos' | null>(null); // State to determine which view to show

  // Function to check if the file is an image
  const isImage = (url: string) => /\.(jpg|jpeg|png|svg|gif|webp)$/i.test(url);

  // Function to check if the file is a video
  const isVideo = (url: string) => /\.(mp4|avi|mov|wmv|webm|MOV)$/i.test(url);

  // Handle opening the gallery view
  const openGalleryView = (type: 'images' | 'videos') => {
    setView(type); // Set the view type to either images or videos
  };

  // Handle closing the gallery view
  const closeGalleryView = () => {
    setView(null); // Reset the view to null to go back to the main gallery
  };

  // If view is set, render the GalleryView component
  if (view) {
    return <GalleryView businessDetailsData={businessDetailsData} type={view} onClose={closeGalleryView} />;
  }

  return (
    <>
    {/* big screen */}
    <div className={styles.wrapperBig}>
      {/* Photos Section */}
      <Card style={styles.card}>
        <Card style={styles.subCard}>
          <h4>Photos</h4>

        </Card>

        {businessDetailsData?.gallery &&
        businessDetailsData?.gallery.filter((item: gallery) => isImage(item?.url))?.length > 0 ? (
          <div className={styles.img_wrapper}>
            {businessDetailsData?.gallery
              .filter((item: gallery) => isImage(item?.url)) // Filter only images
              .map((item: gallery, index: number) => (
                <div key={index} className={styles.imageContainer}>

                  
                  <img src={item?.url} alt={`myimg ${index + 1}`} />
                </div>
              ))}

            {Array.from({
              length: 5 - (businessDetailsData?.gallery.filter((item: gallery) => isImage(item?.url)).length || 0),
            }).map((_, index) => (
              <div key={index} className={styles.imageContainer}></div>
            ))}
          </div>
        ) : (
          <div>
            <p>No available image</p>
          </div>
        )}
      </Card>

      {/* Videos Section */}
      <Card style={styles.card}>
      {/* <Card style={styles.subCard}>
          <div className={styles.spaceBtn }>
          <h4>Videos</h4>
          <p className={styles.seeAll}>See All</p>
          </div>

        </Card> */}

        {businessDetailsData?.gallery &&
        businessDetailsData?.gallery.filter((item: gallery) => isVideo(item?.url))?.length > 0 ? (
          <div className={styles.img_wrapper}>
            {businessDetailsData?.gallery
              .filter((item: gallery) => isVideo(item?.url))
              .map((item: gallery, index: number) => (
                <video key={index} controls playsInline poster={item?.url} className={styles.videoElement}>
                  <source src={item?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}

            {Array.from({
              length: 5 - (businessDetailsData?.gallery.filter((item: gallery) => isVideo(item?.url)).length || 0),
            }).map((_, index) => (
              <div key={index} className={styles.imageContainer}></div>
            ))}
          </div>
        ) : (
          <div>
            <p>No available videos</p>
          </div>
        )}
      </Card>
    </div>


    {/* small screen */}
    <div className={styles.wrapperSmall}>
      {/* Photos Section */}
      <Card style={styles.card}>
        {/* <Card style={styles.subCard}> */}
        <div className={styles.spaceBtn}>
          <h4>Photos</h4>
          <p className={styles.seeAll} onClick={() => openGalleryView('images')}>
            See All  <img src={Right} alt="Right" />
          </p>
        </div>
        <div className="line"></div>
        {/* </Card> */}

        {businessDetailsData?.gallery &&
        businessDetailsData.gallery.filter((item: gallery) => isImage(item?.url)).length > 0 ? (
          <div className={styles.img_wrapper}>
            {businessDetailsData.gallery
              .filter((item: gallery) => isImage(item?.url))
              .slice(0, 2)
              .map((item: gallery, index: number) => (
                <div key={index} className={styles.imageContainer}>
                  <img src={item?.url} alt={`myimg ${index + 1}`} />
                </div>
              ))}
          </div>
        ) : (
          <div>
            <p>No available images</p>
          </div>
        )}
      </Card>

      {/* Videos Section */}
      <Card style={styles.card}>
        {/* <Card style={styles.subCard}> */}
        <div className={styles.spaceBtn}>
          <h4>Videos</h4>
          <p className={styles.seeAll} onClick={() => openGalleryView('videos')}>
            See All   <img src={Right} alt="Right" />
          </p>
        </div>
         <div className="line"></div>
        {/* </Card> */}

        {businessDetailsData?.gallery &&
        businessDetailsData.gallery.filter((item: gallery) => isVideo(item?.url)).length > 0 ? (
          <div className={styles.img_wrapper}>
            {businessDetailsData.gallery
              .filter((item: gallery) => isVideo(item?.url))
              .slice(0, 2)
              .map((item: gallery, index: number) => (
                <video key={index} controls playsInline poster={item?.url} className={styles.videoElement}>
                  <source src={item?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
          </div>
        ) : (
          <div>
            <p>No available videos</p>
          </div>
        )}
      </Card>
    </div>
    </>
  );
}
