import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useTime } from "../../hooks/useTime";

const ChartAp = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function Chart() {
  const { dataAllMonthOfYear } = useTime();

  const months = Array.from({ length: 12 }).map((_, index) => {
    const y = new Date().getFullYear();
    const month = index + 1;
    return new Date(y, month, 0).toISOString();
  });

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: "#fff",
      stacked: true,
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    // colors: ["#000"],
    tooltip: {
      enabled: false,
      fillSeriesColor: false,
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        color: "#ccc",
      },
      labels: {
        datetimeFormatter: {
          month: "MMMM",
        },
      },
      axisTicks: {
        color: "#ccc",
      },

      categories: months,
    },
    fill: {
      opacity: 0.3,
      type: "gradient",
      gradient: {
        shade: "dark",
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    stroke: {
      curve: "smooth",
    },
  };

  const series = [
    {
      name: "series1",
      data: dataAllMonthOfYear ?? [],
    },
  ];
  return (
    <div className="bg-zinc-800 flex-1 rounded backdrop-blur-3xl py-4 h-full">
      <ChartAp
        options={options}
        series={series}
        type="area"
        height="100%"
        width="100%"
      />
    </div>
  );
}
