import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cloud, MapPin, Thermometer } from 'lucide-react';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Report {
  id: number;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  severity: string;
  reportedAt: string;
  estimatedMaterial: string;
  image: string;
}

interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface MapViewProps {
  reports: Report[];
  onReportSelect: (report: Report) => void;
}

// Weather overlay component
function WeatherOverlay({ weatherData }: { weatherData: WeatherData | null }) {
  const map = useMap();

  useEffect(() => {
    if (!weatherData) return;

    // Add weather layer (simplified visualization)
    const weatherLayer = L.layerGroup();
    
    // Add rain intensity overlay (mock implementation)
    if (weatherData.precipitation > 0) {
      const rainOverlay = L.rectangle(map.getBounds(), {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: weatherData.precipitation / 100 * 0.3,
        weight: 0
      });
      weatherLayer.addLayer(rainOverlay);
    }

    weatherLayer.addTo(map);

    return () => {
      map.removeLayer(weatherLayer);
    };
  }, [map, weatherData]);

  return null;
}

const MapView: React.FC<MapViewProps> = ({ reports, onReportSelect }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Mock weather data (replace with actual OpenWeatherMap API)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Mock weather data - replace with actual API call
        const mockWeatherData: WeatherData = {
          temp: 24,
          description: 'Light rain',
          humidity: 78,
          windSpeed: 12,
          precipitation: 15
        };
        setWeatherData(mockWeatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const createCustomIcon = (severity: string) => {
    const color = getMarkerColor(severity);
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div className="space-y-4">
      {/* Weather Info Card */}
      {weatherData && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cloud className="w-5 h-5" />
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-primary" />
                <span>{weatherData.temp}°C</span>
              </div>
              <div>
                <span className="text-muted-foreground">Condition: </span>
                <span>{weatherData.description}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Humidity: </span>
                <span>{weatherData.humidity}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Precipitation: </span>
                <span>{weatherData.precipitation}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Container */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[500px] w-full">
            <MapContainer
              center={[40.7128, -74.0060]} // NYC coordinates
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Weather Overlay */}
              <WeatherOverlay weatherData={weatherData} />
              
              {/* Report Markers */}
              {reports.map((report) => (
                <Marker
                  key={report.id}
                  position={[report.lat, report.lng]}
                  icon={createCustomIcon(report.severity)}
                  eventHandlers={{
                    click: () => {
                      setSelectedReport(report);
                      onReportSelect(report);
                    },
                  }}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[200px]">
                      <h4 className="font-semibold">{report.type}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {report.location}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant={report.status === 'Resolved' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        <Badge variant={report.severity === 'High' ? 'destructive' : 'secondary'}>
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </p>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => onReportSelect(report)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapView;