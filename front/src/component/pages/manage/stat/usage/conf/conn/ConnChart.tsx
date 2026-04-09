import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';

const CONN_COLORS = ['#B299FF', '#7D82B8', '#56CCF2', '#38A1DB', '#F8C471', '#F4A261', '#F28C8C', '#FF686B'];

const ConnChart = () => {
  const usageResult   = useStatStore((s) => s.usageResult);
  const usageConnConf = usageResult?.connConfUsage ?? [];

  const [series, setSeries] = useState<{ name: string; y: number }[]>([]);
  const [allCnt, setAllCnt] = useState<number>(0);

  useEffect(() => {
    if (usageConnConf.length > 0) {
      setSeries(usageConnConf.map((item) => ({ name: item.key, y: item.count })));
      setAllCnt(usageConnConf.reduce((acc, cur) => acc + cur.count, 0));
    } else {
      setSeries([]);
      setAllCnt(0);
    }
  }, [usageConnConf]);

  const options = {
    chart: { type: 'pie', spacing: 0, width: 435, height: 173, marginTop: 174, marginBottom: 20, marginLeft: -10, plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, backgroundColor: 'transparent' },
    title: { text: '접속 건수', floating: true, x: -5, y: 122, style: { fontFamily: 'Pretendard', fontSize: 14, color: '#A8AAB3', fontWeight: 400 } },
    subtitle: { text: allCnt.toLocaleString(), floating: true, x: -5, y: 154, style: { fontFamily: 'Pretendard', fontSize: 28, fontWeight: 600, color: '#FFF' } },
    tooltip: {
      useHTML: true, outside: true, headerFormat: '',
      pointFormat: '<div class="tooltip__box" style="display: flex; align-items: center; padding: 3px 0 1px"><div class="tooltip__name" style="display: flex; align-items: center; font-size: 12px;"><i class="tooltip__mark" style="display: block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; background-color:{point.color}"></i>{point.name}</div><div class="tooltip__value" style="display: flex; align-items: center; margin-left: 8px; font-size: 14px; font-weight: 500; color: #FFF; ">{point.y}<span style="margin-left: 2px; font-size: 12px; font-weight: 400; color: #CECECE; ">({point.percentage:.0f}%)<span></div></div>',
      style: { fontFamily: 'Pretendard', fontWeight: 400, color: '#C8D0E8' },
      backgroundColor: 'rgba(18, 23, 46, 0.92)', borderColor: '#7A45FF', borderRadius: 6, borderWidth: 1,
    },
    accessibility: { announceNewData: { enabled: true }, point: { valueSuffix: '%' } },
    plotOptions: {
      pie: {
        startAngle: -90, endAngle: 90, size: 330, borderWidth: 2, borderColor: '#1A203A',
        allowPointSelect: false, borderRadius: 0, showInLegend: true,
        dataLabels: {
          enabled: true, useHTML: true,
          style: { fontFamily: 'Pretendard', fontSize: 14, fontWeight: 600, textOutline: 0, color: '#fff' },
          formatter: function () {
            const top3 = [...series].splice(0, 3).map((item) => item.name);
            if (top3.includes(this.point.name)) {
              const pct = Math.round(this.point.percentage);
              return `<p style="display:flex;flex-direction:column;align-items:center;justify-content:center;">${this.y}<br/><span style="font-size:12px;color:rgba(255,255,255,0.8)">(${pct}%)</span></p>`;
            }
            return null;
          },
          distance: -33,
        },
      },
      series: { states: { inactive: { opacity: 0.3 } } },
    },
    legend: { enabled: false },
    series: [{ innerSize: '60%', colorByPoint: true, selected: false, data: series }],
    colors: CONN_COLORS,
    credits: { enabled: false },
  };

  return (
    <div className="connectChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ConnChart;
