import React from "react";

function BannerCarousel({ activeBanners }) {
  if (!activeBanners || activeBanners.length === 0) {
    return <p>No active banners</p>;
  }

  return (
    <div className="mb-4">
    <div
      id="bannerCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {activeBanners.map((banner, index) => (
          <button
            key={banner._id}
            type="button"
            data-bs-target="#bannerCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>

      {/* Carousel images */}
      <div className="carousel-inner">
        {activeBanners.map((banner, index) => (
          <div
            key={banner._id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={banner.image}
              className="d-block w-100 rounded"
              alt={banner.title}
              style={{ height: "350px", objectFit: "cover" }}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/800x350?text=No+Image")
              }
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>{banner.title}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#bannerCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
    </div>
  );
}

export default BannerCarousel;
