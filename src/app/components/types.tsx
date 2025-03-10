


interface Coordinates {
    x: number;
    y: number;
  }


export interface ImageItem {
    acq_time: string;
    alt_productid: string;
    api: string | null;
    azimuth_angle: number | null;
    bottomright: Coordinates;
    cloud_cover_percent: number;
    collection_date: string; // Format: MM-DD-YYYY
    collection_vehicle_short: string;
    color: boolean;
    data_type: string | null;
    imageBand: string;
    imageBandCount: number | null;
    js_api: string | null;
    js_date: string; // Format: MM-DD-YYYY
    js_resolution: number;
    length_factor: number;
    look_direction: string | null;
    max_off_nadir: number;
    max_pan_res: number;
    min_off_nadir: number;
    min_pan_res: number;
    mission: string | null;
    multi_res: string | null;
    objectid: string;
    offnadir: number;
    order_id: string;
    orientation_angle: number | null;
    path_direction: number | null;
    polarization_channels: string | null;
    preview_url: string;
    renderOrigin: string | null;
    resolution: string;
    satellite: string | null;
    scan_direction: string | null;
    stereo_pair: string | null;
    sun_az: number;
    sun_elev: number;
    target_az: number | null;
    target_az_max: number | null;
    target_az_min: number | null;
    topleft: Coordinates;
}

interface DateFilter {
  startDate: string;
  endDate: string;
}

export interface Filters {
  cloudcover_max: number;
  offnadir_max: number;
  resolution_min: number;
  resolution_max: number;
  dem: boolean;
  coords: [number, number][];
  seasonal: boolean;
  monthly: boolean;
  dateRange: boolean;
  dateFilter: DateFilter[];
  stereo: boolean;
  lazyLoad: boolean;
  sar: boolean;
  pageNum: number;
  persistentScenes: [];
  startDate: string;
  endDate: string;
  satellites: string[];
}


export interface SaveConfig {
  filter: Filters
  polygon: [number, number][]
  results: ImageItem[]
  selected: string[]
}