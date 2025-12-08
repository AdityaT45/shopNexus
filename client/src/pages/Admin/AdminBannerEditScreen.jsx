import React, { useEffect, useState, useContext } from "react";
import { BannerContext } from "../../context/BannerContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminBannerEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { banners, createBanner, fetchBanners, updateBanner } = useContext(BannerContext);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Active"); // Use string instead of boolean

  const editingBanner = banners.find((b) => b._id === id);

  useEffect(() => {
  fetchBanners();
}, []);

useEffect(() => {
  if (id && editingBanner) {
    setTitle(editingBanner.title);
    setImage(editingBanner.image);
    // Ensure status is "Active" or "Inactive" (strings) - handle both string and boolean for compatibility
    const bannerStatus = editingBanner.status;
    if (bannerStatus === "Active" || bannerStatus === true) {
      setStatus("Active");
    } else if (bannerStatus === "Inactive" || bannerStatus === false) {
      setStatus("Inactive");
    } else {
      setStatus(bannerStatus || "Active"); // Fallback to "Active" if undefined
    }
  }
}, [id, editingBanner]);

  // File Upload Handler
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setImage(data.imageUrl);
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  const newData = { title, image, status };

  if (id) {
    await updateBanner(id, newData);   // await it
  } else {
    await createBanner(newData);
  }

  navigate("/admin/banners");
};

  return (
    <div className='p-4'>
      <h1 className="mb-4">{id ? "Edit Banner" : "Create Banner"}</h1>

          <form onSubmit={submitHandler} className="p-4 border rounded bg-light">

            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Banner Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter banner title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Image Preview */}
            {image && (
              <div className="mb-3">
                <label className="form-label">Preview</label>
                <img
                  src={image}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Upload File */}
            <div className="mb-3">
              <label className="form-label">Upload Banner Image</label>
              <input type="file" className="form-control" onChange={uploadFileHandler} />
            </div>

            <div className="mb-3">
  <label className="form-label">Status</label>
  <select
    className="form-control"
                value={status || "Active"}
                onChange={(e) => setStatus(e.target.value)}
  >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
  </select>
</div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              {id ? "Update Banner" : "Create Banner"}
            </button>

          </form>
    </div>
  );
};

export default AdminBannerEditScreen;
