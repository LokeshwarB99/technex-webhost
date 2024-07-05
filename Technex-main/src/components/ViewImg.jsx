import axios from "axios";
import React, { useState } from "react";

const ViewImg = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post("https://tech-back-sgqm.onrender.com/bs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleFetchImage = async () => {
    try {
      const response = await axios.get("https://tech-back-sgqm.onrender.com/bs/latest", {
        responseType: "blob",
      });
      const imageBlob = response.data;
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setFetchedImage(imageObjectURL);
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
      <button onClick={handleFetchImage}>Fetch Latest Image</button>
      {fetchedImage && <img src={fetchedImage} alt="Fetched from server" />}
    </div>
  );
};

export default ViewImg;
