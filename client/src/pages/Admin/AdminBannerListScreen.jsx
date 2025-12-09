import React, { useEffect, useContext } from "react";
import { BannerContext } from "../../context/BannerContext";
import { Link } from "react-router-dom";
import AdminSidebar from "../../component/Admin/AdminSidebar";

const AdminBannerListScreen = () => {
  const { banners, loading, error, fetchBanners, deleteBanner, updateBanner } =
    useContext(BannerContext);

  useEffect(() => {
    fetchBanners();
  }, []);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id);
    }
  };

  const handleStatusChange = async (bannerId, newStatus) => {
    const banner = banners.find((b) => b._id === bannerId);
    if (banner) {
      const bannerData = {
        title: banner.title,
        image: banner.image,
        status: newStatus, // "Active" or "Inactive" string
        link: banner.link || ""
      };
      try {
        await updateBanner(bannerId, bannerData);
      } catch (error) {
        console.error("Failed to update banner status:", error);
        alert("Failed to update banner status. Please try again.");
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '56px' }}>
          <AdminSidebar />
      <div className='p-4 admin-content' style={{ marginLeft: '280px' }}>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Banner Management</h1>

            <Link to="/admin/banner/create" className="btn btn-success">
              <i className="fas fa-plus me-1"></i> Add Banner
            </Link>
          </div>

          {loading && <h4>Loading...</h4>}
          {error && <div className="alert alert-danger">{error}</div>}

          <table className="table table-striped table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>Banner Image</th>
                <th>Title</th>
                <th>Actions</th>
                <th >Status</th>

              </tr>
            </thead>

            <tbody>
              {banners.map((banner) => (
                <tr key={banner._id}>
                  <td>
                    <img
  src={banner.image.startsWith("http") ? banner.image : `http://localhost:5000${banner.image}`}
  alt="banner"
  style={{ width: "100px", height: "60px", objectFit: "cover" }}
/>
                  </td>

                  <td>{banner.title}</td>

                  <td>
                    <Link to={`/admin/banner/${banner._id}`} className="btn btn-warning btn-sm">
  Edit
</Link>

                    <button
                      onClick={() => deleteHandler(banner._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>

                  <td className="border p-2">
                    <select
                      className="form-select form-select-sm"
                      value={banner.status || "Inactive"}
                      onChange={(e) => handleStatusChange(banner._id, e.target.value)}
                      disabled={loading}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
</td>

                </tr>
              ))}

              

              {banners.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-muted">
                    No banners found.
                  </td>
                </tr>
              )}

              
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default AdminBannerListScreen;
