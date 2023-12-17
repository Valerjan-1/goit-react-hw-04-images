import ImageGalleryItem from './ImageGalleryItem';

const ImageGallery = ({ images, openModal }) => {
  console.log(images);
  return (
    <ul className="ImageGallery">
      {images.map(image => (
        <ImageGalleryItem key={image.id} image={image} openModal={openModal} />
      ))}
    </ul>
  );
};

export default ImageGallery;
