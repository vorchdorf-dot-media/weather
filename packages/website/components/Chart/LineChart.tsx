import { useMemo, useRef } from 'preact/hooks';
import { curveNatural } from '@visx/curve';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import type { EntrySchema } from 'functions/dist/db/schemata/entry';
import type { StationSchema } from 'functions/dist/db/schemata/station';

import styles from 'components/Chart/LineChart.module.css';

const getDate = ({ timestamp }: EntrySchema): number =>
  Date.parse((timestamp as unknown) as string);
const getFeels = ({ feels }: EntrySchema): number => feels as number;
const getTemperature = ({ temperature }: EntrySchema): number =>
  temperature as number;
const getTemperature2 = ({ temperature2 }: EntrySchema): number =>
  temperature2 as number;

const LineChart = ({
  data,
  height: propHeight,
  width: propWidth,
}: {
  data: EntrySchema[];
  height?: number;
  width?: number;
}): JSX.Element => {
  const [{ station }] = data;
  const { temperature, temperature2 } = (station as StationSchema)?.config;

  const svgRef = useRef(null);

  const width = useMemo(() => propWidth ?? svgRef?.current?.clientWidth, [
    propWidth,
    svgRef?.current?.clientWidth,
  ]);

  const height = useMemo(() => propHeight ?? width * 0.75, [propHeight, width]);

  const max = useMemo(
    () =>
      Math.max(
        ...data.map((d: EntrySchema) =>
          Math.max(getTemperature(d), getTemperature2(d), getFeels(d))
        )
      ),
    [data]
  );

  const maxDate = useMemo(
    () =>
      Math.max(
        Date.parse((data[0].timestamp as unknown) as string),
        Date.parse((data[data.length - 1].timestamp as unknown) as string)
      ),
    [data]
  );

  const min = useMemo(
    () =>
      Math.min(
        ...data.map((d: EntrySchema) =>
          Math.min(getTemperature(d), getTemperature2(d), getFeels(d))
        )
      ),
    [data]
  );

  const minDate = useMemo(
    () =>
      Math.min(
        Date.parse((data[0].timestamp as unknown) as string),
        Date.parse((data[data.length - 1].timestamp as unknown) as string)
      ),
    [data]
  );

  const scaleDate = useMemo(
    () =>
      scaleTime<number>({
        domain: [minDate, maxDate] as [number, number],
        range: [0, width],
      }),
    [data, width]
  );

  const scaleTemperature = useMemo(
    () =>
      scaleLinear<number>({
        domain: [min, max] as [number, number],
        range: [height - Math.abs(max), 100 + Math.abs(min)],
      }),
    [min, max, height]
  );

  return (
    <svg className={styles.chart} ref={svgRef} width={width} height={height}>
      {width > 0 && temperature === 'OUT' && (
        <LinePath
          curve={curveNatural}
          data={data}
          x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
          y={(d: EntrySchema) => scaleTemperature(getTemperature(d)) ?? 0}
        />
      )}
      {width > 0 && temperature2 === 'OUT' && (
        <>
          <LinePath
            curve={curveNatural}
            data={data}
            x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
            y={(d: EntrySchema) => scaleTemperature(getTemperature2(d)) ?? 0}
          />
          <LinePath
            className={styles.feels}
            curve={curveNatural}
            data={data}
            x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
            y={(d: EntrySchema) => scaleTemperature(getFeels(d)) ?? 0}
          />
        </>
      )}
    </svg>
  );
};

export default LineChart;
