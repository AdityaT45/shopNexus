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

          <div className="table-responsive">
            <table className="table table-striped table-hover mt-3">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "120px" }}>Image</th>
                  <th>Title</th>
                  <th>Link</th>
                  <th style={{ width: "150px" }}>Status</th>
                  <th style={{ width: "180px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id}>
                    <td>
                      <img
                        src={banner.image.startsWith("http") ? banner.image : `http://localhost:5000${banner.image}`}
                        alt={banner.title}
                        style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x60?text=Error';
                        }}
                      />
                    </td>

                    <td>
                      <strong>{banner.title}</strong>
                    </td>

                    <td>
                      {banner.link ? (
                        <a 
                          href={banner.link.startsWith('http') ? banner.link : `#${banner.link}`}
                          target={banner.link.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <i className="fas fa-link me-1"></i>
                          {banner.link.length > 30 ? `${banner.link.substring(0, 30)}...` : banner.link}
                        </a>
                      ) : (
                        <span className="text-muted">No link</span>
                      )}
                    </td>

                    <td>
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

                    <td>
                      <div className="btn-group" role="group">
                        <Link 
                          to={`/admin/banner/${banner._id}`} 
                          className="btn btn-warning btn-sm"
                          title="Edit Banner"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => deleteHandler(banner._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete Banner"
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              

                {banners.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="fas fa-image fa-3x mb-3 d-block"></i>
                      No banners found. Create your first banner to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default AdminBannerListScreen;
