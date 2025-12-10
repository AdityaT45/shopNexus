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
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const editingBanner = banners.find((b) => b._id === id);

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id && editingBanner) {
      setTitle(editingBanner.title || "");
      setImage(editingBanner.image || "");
      setLink(editingBanner.link || "");
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
    if (!file) return;

    setUploading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImage(data.imageUrl);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!image.trim()) {
      setError("Image is required");
      return;
    }

    try {
      const newData = { title: title.trim(), image: image.trim(), status, link: link.trim() };

      if (id) {
        await updateBanner(id, newData);
      } else {
        await createBanner(newData);
      }

      navigate("/admin/banners");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save banner. Please try again.");
      console.error("Save error:", error);
    }
  };

  return (
    <div className='p-4'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{id ? "Edit Banner" : "Create Banner"}</h1>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate("/admin/banners")}
        >
          <i className="fas fa-arrow-left me-1"></i> Back to Banners
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submitHandler} className="p-4 border rounded bg-light">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Banner Title <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter banner title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Link */}
        <div className="mb-3">
          <label className="form-label">Banner Link (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., /products/123 or https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <small className="form-text text-muted">
            Where users should be redirected when clicking the banner. Leave empty for no link.
          </small>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mb-3">
            <label className="form-label">Image Preview</label>
            <div className="border rounded p-2 bg-white">
              <img
                src={image.startsWith("http") ? image : `http://localhost:5000${image}`}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "contain", width: "100%" }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                }}
              />
            </div>
          </div>
        )}

        {/* Upload File */}
        <div className="mb-3">
          <label className="form-label">Upload Banner Image <span className="text-danger">*</span></label>
          <input 
            type="file" 
            className="form-control" 
            onChange={uploadFileHandler}
            accept="image/*"
            disabled={uploading}
          />
          {uploading && (
            <div className="mt-2">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
              <small className="text-muted">Uploading image...</small>
            </div>
          )}
          <small className="form-text text-muted">
            Recommended size: 1200x400px or similar aspect ratio
          </small>
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status || "Active"}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save me-1"></i>
                {id ? "Update Banner" : "Create Banner"}
              </>
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/banners")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBannerEditScreen;
