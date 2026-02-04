"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";

interface CatalogItem {
  id: number;
  satellite_shortname?: string;
  title: string;
  images: string[];
  previewImages: string[];
  // date: string;
  // location: string;
  // cloud: string;
  description: string;
  specs: { label: string; value: string }[];
  price: string;
  info: string;
}

interface SatelliteImageCatalogProps {
  onClose?: () => void;
}

const baseCatalogData: CatalogItem[] = [
  {
    id: 1,
    title: "Pleiades",
    satellite_shortname: "PNEO",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PLEIADES/kebun.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PLEIADES/pabrik1.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PLEIADES/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PLEIADES/kebun.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PLEIADES/pabrik1.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PLEIADES/tambang.jpg",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "0.5 m (Pankromatik), 2 m (Multispektral)",
      },
      { label: "Resolusi Temporal", value: "2 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (480–830 nm), Blue (430–550 nm), Green (490–610 nm), Red (600–720 nm), NIR (750–950 nm)",
      },
      { label: "Altitude", value: "695 km" },
      { label: "Orbit", value: "Sun Synchronous" },
      { label: "Lebar Sapuan", value: "20 km" },
    ],
    price: "Loading...",
    info: "Satelit Pleiades-1A menyediakan citra 0.5 m pankromatik dan 2 m multispektral, ideal untuk analisis urban dan vegetasi.",
  },
  {
    id: 2,
    title: "Ikonos",
    satellite_shortname: "IK02",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Ikonos/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Ikonos/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Ikonos/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Ikonos/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Ikonos/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Ikonos/tambang.jpg",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "0.8 m (Pankromatik), 3.28 m (Multispektral)",
      },
      { label: "Resolusi Temporal", value: "3 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (450–900 nm), Blue (445–516 nm), Green (506–595 nm), Red (632–698 nm), NIR (757–853 nm)",
      },
      { label: "Altitude", value: "681 km" },
      { label: "Orbit", value: "Sun synchronous, 10:30 Pagi" },
      { label: "Lebar Sapuan", value: "11.3–13.8 km" },
    ],
    price: "Loading...",
    info: "Satelit Ikonos menghasilkan citra 0.8 meter, cocok untuk analisis perubahan lahan dan perkotaan.",
  },
  {
    id: 3,
    title: "QuickBird",
    satellite_shortname: "QB",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/QB/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/QB/permukiman(Perkebunan).jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/QB/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/QB/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/QB/permukiman(Perkebunan).jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/QB/tambang.jpg",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "0.61 m (Pankromatik), 2.4 m (Multispektral)",
      },
      { label: "Resolusi Temporal", value: "3–7 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (450–1053 nm), Blue (430–545 nm), Green (466–620 nm), Red (590–710 nm), NIR (715–918 nm)",
      },
      { label: "Altitude", value: "450 km" },
      { label: "Orbit", value: "Sun Synchronous" },
      { label: "Lebar Sapuan", value: "14.9 km" },
    ],
    price: "Loading...",
    info: "QuickBird memberikan citra 0.61 m pankromatik untuk analisis detail urban, vegetasi, dan infrastruktur.",
  },
  {
    id: 4,
    title: "WorldView",
    satellite_shortname: "WV2",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/WV/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/WV/kebun.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/WV/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/WV/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/WV/kebun.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/WV/tambang.jpg",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "0.46 m (Pankromatik), 1.84 m (Multispektral)",
      },
      { label: "Resolusi Temporal", value: "2 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (450–800 nm), Coastal Blue (400–450 nm), Blue (450–510 nm), Green (510–580 nm), Yellow (585–625 nm), Red (639–690 nm), Red Edge (705–745 nm), NIR1 (770–895 nm), NIR2 (860–1040 nm)",
      },
      { label: "Altitude", value: "770 km" },
      { label: "Orbit", value: "Sun synchronous, 10:30 Pagi" },
      { label: "Lebar Sapuan", value: "16.4 km" },
    ],
    price: "Loading...",
    info: "WorldView-2 menyediakan 8 band spektral untuk analisis kompleks, cocok untuk pemetaan lingkungan dan wilayah pesisir.",
  },
  {
    id: 5,
    title: "GeoEye",
    satellite_shortname: "GE1",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/GeoEye/perkebunan.png",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/GeoEye/pabrik%2Bpemukiman.png",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/GeoEye/tambang.png",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/GeoEye/perkebunan.png",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/GeoEye/pabrik%2Bpemukiman.png",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/GeoEye/tambang.png",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "0.46 m (Pankromatik), 1.84 m (Multispektral)",
      },
      { label: "Resolusi Temporal", value: "2.6 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (450–800 nm), Blue (450–510 nm), Green (510–580 nm), Red (655–690 nm), NIR (780–920 nm)",
      },
      { label: "Altitude", value: "770 km" },
      { label: "Orbit", value: "Sun Synchronous" },
      { label: "Lebar Sapuan", value: "15.3 km" },
    ],
    price: "Loading...",
    info: "GeoEye-1 menghasilkan citra 0.46 m dengan ketepatan tinggi, cocok untuk survei geospasial.",
  },
  {
    id: 6,
    title: "Kompsat-3A",
    satellite_shortname: "K3A",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Komsat/pertanian.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Komsat/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Komsat/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Komsat/pertanian.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Komsat/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/Komsat/tambang.jpg",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "0.55 m (Pankromatik), 2.2 m (Multispektral), 5.5 m (Mid-IR)",
      },
      { label: "Resolusi Temporal", value: "28 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (450–900 nm), Blue (450–520 nm), Green (520–600 nm), Red (630–690 nm), NIR (760–900 nm)",
      },
      { label: "Altitude", value: "528 km" },
      { label: "Orbit", value: "Sun synchronous, 13:30 Pagi" },
      { label: "Lebar Sapuan", value: "12 km" },
    ],
    price: "Loading...",
    info: "Kompsat-3A memiliki 4 band utama dan sensor inframerah jarak menengah, ideal untuk analisis geologi dan vegetasi.",
  },
  {
    id: 7,
    title: "SPOT 7/6",
    satellite_shortname: "SP6",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/SPOT+baru/pabrik(SPOT6).jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/SPOT+baru/Perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/SPOT+baru/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/SPOT+baru/pabrik(SPOT6).jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/SPOT+baru/Perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/SPOT+baru/tambang.jpg",
    ],
    description: "Minimal Order | 25Km",
    specs: [
      {
        label: "Resolusi Spasial",
        value: "1.5 m (Pankromatik), 6 m (Multispektral)",
      },
      {
        label: "Resolusi Temporal",
        value: "1–3 Hari (bersamaan dengan SPOT-7)",
      },
      {
        label: "Resolusi Spektral",
        value:
          "Pankromatik (450–745 nm), Blue (455–525 nm), Green (530–590 nm), Red (625–695 nm), Near Infrared (760–890 nm)",
      },
      { label: "Altitude/Ketinggian", value: "694 km" },
      { label: "Tipe Orbit", value: "Sun synchronous" },
      {
        label: "Lebar Sapuan",
        value: "10–60 km (tergantung resolusi spasial dan jumlah detector)",
      },
    ],
    price: "Loading...",
    info: "SPOT 6/7 memberikan cakupan luas dan temporal cepat, ideal untuk pemetaan regional dan monitoring lahan.",
  },
  {
    id: 8,
    title: "PlanetScope",
    satellite_shortname: "PS",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PSS/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PSS/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PSS/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PSS/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PSS/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/PSS/tambang.jpg",
    ],
    description: "Minimal Order | 100Km",
    specs: [
      { label: "Resolusi Spasial", value: "3 meter" },
      { label: "Resolusi Temporal", value: "1 Hari" },
      {
        label: "Resolusi Spektral",
        value:
          "Blue (450–510 nm), Green (500–590 nm), Red (590–670 nm), Near Infrared (780–860 nm)",
      },
      { label: "Altitude/Ketinggian", value: "475 km" },
      { label: "Tipe Orbit", value: "Sun synchronous" },
      { label: "Lebar Sapuan", value: "24.6 × 16 km" },
    ],
    price: "Loading...",
    info: "PlanetScope menawarkan citra 3 meter harian dengan 4 band utama, cocok untuk monitoring vegetasi dan perubahan lahan.",
  },
  {
    id: 9,
    title: "RapidEye",
    satellite_shortname: "REO",
    images: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/RapidEye/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/RapidEye/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/RapidEye/tambang.jpg",
    ],
    previewImages: [
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/RapidEye/pabrik.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/RapidEye/perkebunan.jpg",
      "https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/assets/catalog/RapidEye/tambang.jpg",
    ],
    description: "Minimal Order | 100Km",
    specs: [
      { label: "Resolusi Spasial", value: "5 meter" },
      {
        label: "Resolusi Temporal",
        value: "1 Hari (Off-nadir) / 5.5 Hari (Nadir)",
      },
      {
        label: "Resolusi Spektral",
        value:
          "Blue (440–510 nm), Green (520–590 nm), Red (630–685 nm), Red Edge (690–730 nm), Near Infrared (760–850 nm)",
      },
      { label: "Altitude/Ketinggian", value: "630 km" },
      { label: "Tipe Orbit", value: "Sun synchronous" },
      { label: "Lebar Sapuan", value: "77 km" },
    ],
    price: "Loading...",
    info: "RapidEye menyediakan citra 5 m dengan 5 band multispektral, ideal untuk pertanian dan pemetaan skala menengah.",
  },
];

export default function SatelliteImageryCatalog({
  onClose,
}: SatelliteImageCatalogProps = {}) {
  // const [sliders, setSliders] = useState<any[]>([]);
  const [currentSlides, setCurrentSlides] = useState<number[]>([]);
  const [previewCurrentSlide, setPreviewCurrentSlide] = useState(0);
  const [previewTotalSlides, setPreviewTotalSlides] = useState(0);
  const [isPreviewModalActive, setIsPreviewModalActive] = useState(false);
  const [catalogData, setCatalogData] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  // Helper to translate labels
  const getLabel = (label: string) => {
    if (label.includes("Resolusi Spasial")) return t.spatialResolution;
    if (label.includes("Resolusi Temporal")) return t.temporalResolution;
    if (label.includes("Resolusi Spektral")) return t.spectralResolution;
    if (label.includes("Altitude")) return t.altitude;
    if (label.includes("Orbit")) return t.orbit;
    if (label.includes("Lebar Sapuan")) return t.swathWidth;
    return label;
  };

  const [previewData, setPreviewData] = useState({
    title: "",
    images: [] as string[],
    info: "",
  });

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const updatedCatalog = await Promise.all(
          baseCatalogData.map(async (item) => {
            if (item.satellite_shortname) {
              const response = await fetch(
                `https://gpj8t6ikq1.execute-api.ap-southeast-1.amazonaws.com/v1/images-pricing?satellite_shortname=${item.satellite_shortname}`
              );
              const data = await response.json();

              if (data.success) {
                const priceIDR = Math.floor(data.data.price_per_km);
                return {
                  ...item,
                  price: `Rp ${priceIDR.toLocaleString("id-ID")}`,
                  info: `${item.description
                    }. Price per km: Rp ${priceIDR.toLocaleString("id-ID")}`,
                };
              }
            }
            return item;
          })
        );

        setCatalogData(updatedCatalog);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setCatalogData(baseCatalogData);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const initSliders = useCallback(() => {
    const initialSlides = catalogData.map(() => 0);
    setCurrentSlides(initialSlides);
  }, [catalogData]);

  const moveSlide = (direction: number, sliderIndex: number) => {
    setCurrentSlides((prev) => {
      const newSlides = [...prev];
      const slideCount = catalogData[sliderIndex].images.length;

      newSlides[sliderIndex] += direction;
      if (newSlides[sliderIndex] < 0) {
        newSlides[sliderIndex] = slideCount - 1;
      } else if (newSlides[sliderIndex] >= slideCount) {
        newSlides[sliderIndex] = 0;
      }

      return newSlides;
    });
  };

  const goToSlide = (slideIndex: number, sliderIndex: number) => {
    setCurrentSlides((prev) => {
      const newSlides = [...prev];
      newSlides[sliderIndex] = slideIndex;
      return newSlides;
    });
  };

  const showPreview = (title: string, images: string[], info: string) => {
    setPreviewData({ title, images, info });
    setPreviewCurrentSlide(0);
    setPreviewTotalSlides(images.length);
    setIsPreviewModalActive(true);
  };

  const closePreview = () => {
    setIsPreviewModalActive(false);
  };

  const movePreviewSlide = (direction: number) => {
    setPreviewCurrentSlide((prev) => {
      let newSlide = prev + direction;
      if (newSlide < 0) {
        newSlide = previewTotalSlides - 1;
      } else if (newSlide >= previewTotalSlides) {
        newSlide = 0;
      }
      return newSlide;
    });
  };

  const goToPreviewSlide = (index: number) => {
    setPreviewCurrentSlide(index);
  };

  // const confirmDownload = () => {
  //   alert(`Downloading ${previewData.title}...`);
  //   closePreview();
  // };

  useEffect(() => {
    initSliders();
  }, [initSliders]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewModalActive) {
        if (e.key === "ArrowLeft") {
          movePreviewSlide(-1);
        } else if (e.key === "ArrowRight") {
          movePreviewSlide(1);
        } else if (e.key === "Escape") {
          closePreview();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewModalActive, movePreviewSlide]);

  return (
    <>
      <div className="overlay">
        <div className="modal-panel">
          <button
            className="close-btn"
            onClick={onClose || (() => alert("Close clicked"))}
            aria-label={t.close}
          >
            ×
          </button>

          <h1 className="modal-title">{t.satelliteImageryCatalog}</h1>

          <div className="modal-content">
            <p
              style={{
                marginBottom: "12px",
                fontSize: "13px",
                textAlign: "center",
              }}
            >

              {t.catalogDescription}
            </p>
          </div>

          {/* ✅ Tampilkan loading atau catalog */}
          {loading ? (
            <div className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-greensecondarycolor border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white mt-4 text-sm">
                  {t.loadingWait}
                </p>
              </div>
            </div>
          ) : (
            <div className="catalog-grid">
              {catalogData.map((item, index) => (
                <div key={item.id} className="catalog-card">
                  <div className="image-section">
                    <div className="slider-container">
                      <div
                        className="slides"
                        style={{
                          transform: `translateX(${-currentSlides[index] * 100
                            }%)`,
                        }}
                      >
                        {item.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="slide">
                            <img
                              src={img}
                              alt={`${item.title} - Image ${imgIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        className="slider-btn prev-btn"
                        onClick={() => moveSlide(-1, index)}
                      >
                        ❮
                      </button>
                      <button
                        className="slider-btn next-btn"
                        onClick={() => moveSlide(1, index)}
                      >
                        ❯
                      </button>
                      <div className="slider-dots">
                        {item.images.map((_, dotIndex) => (
                          <span
                            key={dotIndex}
                            className={`dot ${dotIndex === currentSlides[index] ? "active" : ""
                              }`}
                            onClick={() => goToSlide(dotIndex, index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="description-section">
                    <div>
                      <h2 className="catalog-title">{item.title}</h2>
                      <hr></hr>
                      <div className="catalog-meta"></div>
                      <div className="catalog-specs">
                        {item.specs.map((spec, specIndex) => (
                          <div key={specIndex} className="spec-item">
                            <span className="spec-label">{getLabel(spec.label)}</span>
                            {spec.value}
                          </div>
                        ))}
                      </div>
                      <hr></hr>

                      <div className="price-section">
                        <div className="price-label">💰 {t.pricePerKm}</div>
                        <div className="price-value">{item.price}</div>
                        <p className="catalog-description">
                          {item.description.replace("Minimal Order", t.minimalOrder)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="download-btn"
                      onClick={() =>
                        showPreview(item.title, item.previewImages, item.info)
                      }
                    >

                      {t.preview}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`preview-modal ${isPreviewModalActive ? "active" : ""}`}>
        <button className="preview-close" onClick={closePreview}>
          ×
        </button>
        <div className="preview-content">
          <h2 className="preview-title">{previewData.title}</h2>

          <div className="preview-slider-container">
            <div
              className="preview-slides"
              style={{
                transform: `translateX(${-previewCurrentSlide * 100}%)`,
              }}
            >
              {previewData.images.map((img, index) => (
                <div key={index} className="preview-slide">
                  <img src={img} alt="Preview" />
                </div>
              ))}
            </div>
            <button
              className="preview-slider-btn preview-prev-btn"
              onClick={() => movePreviewSlide(-1)}
            >
              ❮
            </button>
            <button
              className="preview-slider-btn preview-next-btn"
              onClick={() => movePreviewSlide(1)}
            >
              ❯
            </button>
            <div className="preview-slide-label">
              Image {previewCurrentSlide + 1}
            </div>
            <div className="preview-dots">
              {previewData.images.map((_, index) => (
                <span
                  key={index}
                  className={`preview-dot ${index === previewCurrentSlide ? "active" : ""
                    }`}
                  onClick={() => goToPreviewSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="preview-counter">
            <span>
              {previewCurrentSlide + 1} / {previewTotalSlides}
            </span>
          </div>

          <div className="preview-info">
            <p>
              <strong>{t.moreInformation}</strong>
            </p>
            <p>
              {previewData.info} | {t.moreInfoContact}
              ruangbumipersada@gmail.com{" "}
            </p>
          </div>

          <div className="preview-buttons">
            <button
              className="preview-btn preview-btn-secondary"
              onClick={closePreview}
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Poppins", sans-serif;
          background: #0f2a11;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e6ffe0;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          z-index: 50;
        }

        @media (max-width: 640px) {
          .overlay {
            padding: 16px;
          }
        }

        .modal-panel {
          background: #000;
          color: #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 100%;
          box-shadow: 0 0 25px rgba(203, 254, 51, 0.2);
          position: relative;
          animation: pop 0.4s ease-out;
          max-height: 95vh;
          overflow-y: auto;
        }

        @media (min-width: 641px) {
          .modal-panel {
            max-width: 1280px;
            padding: 32px;
          }
        }

        @keyframes pop {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 24px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        @media (min-width: 641px) {
          .close-btn {
            top: 16px;
            right: 16px;
          }
        }

        .close-btn:hover {
          color: white;
          transform: scale(1.1);
        }

        .modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        @media (min-width: 641px) {
          .modal-title {
            font-size: 16px;
            margin-bottom: 24px;
          }
        }

        .modal-content {
          text-align: left;
          color: #d1d5db;
          margin-bottom: 24px;
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        @media (max-width: 1024px) {
          .catalog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .catalog-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .catalog-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        .catalog-card {
          background: #011501;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .catalog-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .image-section {
          position: relative;
          background: #000;
          height: 120px;
          overflow: hidden;
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slides {
          display: flex;
          transition: transform 0.5s ease-in-out;
          height: 100%;
        }

        .slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.85);
          border: none;
          color: #333;
          padding: 4px 5px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.3s;
          z-index: 10;
        }

        .slider-btn:hover {
          background: rgba(255, 255, 255, 1);
        }

        .prev-btn {
          left: 0;
        }

        .next-btn {
          right: 0;
        }

        .slider-dots {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 3px;
          z-index: 10;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: background 0.3s;
        }

        .dot.active {
          background: white;
        }

        .description-section {
          padding: 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .catalog-title {
          font-size: 14px;
          color: #f1f5f9;
          margin-bottom: 6px;
          font-weight: bold;
          line-height: 1.1;
        }

        .catalog-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 6px;
        }

        .meta-item {
          display: flex;
          gap: 3px;
          color: #cbd5e1;
          font-size: 11px;
        }

        .meta-label {
          font-weight: bold;
          color: #10b981;
          min-width: 50px;
        }

        .catalog-description {
          color: #cbd5e1;
          line-height: 1.3;
          margin-bottom: 6px;
          margin-top: 6px;
          font-size: 10px;
          text-align: center;
        }

        .catalog-specs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
          margin-top: 6px;
          margin-bottom: 6px;
        }

        .spec-item {
          background: #3b3d41;
          padding: 5px;
          border-radius: 3px;
          font-size: 12px;
        }

        .spec-label {
          font-weight: bold;
          color: #cbfe33;
          display: block;
          margin-bottom: 1px;
        }

        .price-section {
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.1) 0%,
            rgba(5, 150, 105, 0.1) 100%
          );
          padding: 8px;
          border-radius: 5px;
          margin-bottom: 6px;
          margin-top: 10px;
          text-align: center;
          border-left: 3px solid #cbfe33;
        }

        .price-label {
          font-size: 10px;
          color: #b6e42e;
          font-weight: bold;
        }

        .price-value {
          font-size: 14px;
          color: #fff;
          font-weight: bold;
          margin-top: 2px;
        }

        .download-btn {
          background: linear-gradient(135deg, #70e000, #cbfe33);
          color: #0f172a;
          border: none;
          padding: 6px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
          margin-top: 6px;
          transition: transform 0.2s;
        }

        .download-btn:hover {
          transform: scale(1.05);
        }

        .buttons-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 32px;
          margin-bottom: 16px;
          gap: 8px;
        }

        @media (min-width: 641px) {
          .buttons-container {
            flex-direction: row;
            gap: 12px;
            margin-top: 56px;
            margin-bottom: 24px;
          }
        }

        .btn {
          padding: 8px 16px;
          font-weight: bold;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        @media (min-width: 641px) {
          .btn {
            padding: 8px 24px;
          }
        }

        .btn-secondary {
          background: #4b5563;
          color: white;
        }

        .btn-secondary:hover {
          background: #dc2626;
        }

        .btn-primary {
          background: #10b981;
          color: #0f172a;
        }

        .btn-primary:hover {
          background: #059669;
        }

        .preview-modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(4px);
          z-index: 100;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .preview-modal.active {
          display: flex;
        }

        .preview-content {
          background: #001d03c7;
          border-radius: 12px;
          padding: 20px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: pop 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .preview-content {
            padding: 15px;
            border-radius: 8px;
          }
        }

        .preview-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 28px;
          cursor: pointer;
          transition: color 0.2s;
          z-index: 101;
        }

        .preview-close:hover {
          color: white;
        }

        .preview-title {
          font-size: 18px;
          font-weight: bold;
          color: #ffff;
          margin-bottom: 15px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .preview-title {
            font-size: 18px;
            margin-bottom: 12px;
          }
        }

        .preview-slider-container {
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 15px;
          aspect-ratio: 16/10;
        }

        .preview-slides {
          display: flex;
          transition: transform 0.5s ease-in-out;
          height: 100%;
        }

        .preview-slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
        }

        .preview-slide-label {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(0, 0, 0, 0.7);
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
        }

        .preview-slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: #0000009c;
          border: none;
          color: white;
          padding: 12px 15px;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.3s;
          z-index: 10;
          border-radius: 6px;
        }

        .preview-slider-btn:hover {
          background: #8bc34a;
          transform: translateY(-50%) scale(1.1);
        }

        .preview-prev-btn {
          left: 15px;
        }

        .preview-next-btn {
          right: 15px;
        }

        .preview-dots {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .preview-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s;
        }

        .preview-dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .preview-dot.active {
          background: #8bc34a;
          transform: scale(1.2);
        }

        .preview-info {
          background: #0f3410;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .preview-info p {
          color: #ffffff;
          font-size: 13px;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .preview-info strong {
          color: #ffffff;
        }

        .preview-counter {
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          margin-bottom: 15px;
        }

        .preview-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .preview-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
          transition: all 0.2s;
        }

        .preview-btn-primary {
          background: #10b981;
          color: #0f172a;
        }

        .preview-btn-primary:hover {
          background: #059669;
        }

        .preview-btn-secondary {
          background: #ff0000;
          color: white;
        }

        .preview-btn-secondary:hover {
          background: #d95f5f;
        }
      `}</style>
    </>
  );
}
