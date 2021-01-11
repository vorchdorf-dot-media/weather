import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveNatural } from '@visx/curve';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { Threshold } from '@visx/threshold';
import type { EntrySchema } from 'functions/dist/db/schemata/entry';
import type { StationSchema } from 'functions/dist/db/schemata/station';

import { formatNumber } from 'utils/helpers';

import styles from 'components/Chart/TemperatureChart.module.css';

const getDate = ({ timestamp }: EntrySchema): number =>
  Date.parse((timestamp as unknown) as string);
const getTemperature = ({ temperature }: EntrySchema): number =>
  temperature as number;
const getTemperature2 = ({ temperature2 }: EntrySchema): number =>
  temperature2 as number;

const TemperatureChart = ({
  data,
  station,
  height: propHeight,
  margin = 42,
  title,
  width: propWidth,
}: {
  data: EntrySchema[];
  station: StationSchema;
  title: string;
  height?: number;
  margin?: number;
  width?: number;
}): JSX.Element => {
  const { temperature, temperature2 } = station?.config;
  const isTemperature = temperature === 'OUT';
  const isTemperature2 = temperature2 === 'OUT';

  const [height, setHeight] = useState(propHeight);
  const [width, setWidth] = useState(propWidth);

  const getTemperatureIntersect = ({
    temperature,
    temperature2,
  }: EntrySchema) => {
    return isTemperature && isTemperature2
      ? (temperature + temperature2) * 0.5
      : isTemperature
      ? temperature
      : temperature2;
  };

  const filter = (d: EntrySchema) =>
    [].concat(
      isTemperature ? [getTemperature(d)] : [],
      isTemperature2 ? [getTemperature2(d)] : []
    ) as number[];

  const svgRef = useRef(null);
  useEffect(() => {
    const w = svgRef.current?.clientWidth;
    !width && setWidth(w);
    !height && setHeight(w * 0.75);
  }, [svgRef.current?.clientWidth]);

  const max = useMemo(
    () => Math.max(...data.map((d: EntrySchema) => Math.max(...filter(d)))),
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
    () => Math.min(...data.map((d: EntrySchema) => Math.min(...filter(d)))),
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
        range: [0, width - margin],
      }),
    [data, width]
  );

  const scaleTemperature = useMemo(
    () =>
      scaleLinear<number>({
        domain: [min, max] as [number, number],
        range: [height, margin],
      }),
    [min, max, height]
  );

  return (
    <svg className={styles.chart} ref={svgRef} width={width} height={height}>
      <title>{title}</title>
      {width > 0 && (
        <Group left={margin} top={margin * -0.75}>
          <GridColumns
            scale={scaleDate}
            width={width}
            height={height}
            stroke="currentColor"
            strokeWidth={0.25}
          />
          <GridRows
            scale={scaleTemperature}
            width={width}
            height={height}
            stroke="currentColor"
            strokeWidth={0.25}
          />
          <AxisLeft
            numTicks={width <= 375 ? 8 : 16}
            scale={scaleTemperature}
            stroke="currentColor"
            tickFormat={(v: number) =>
              `${formatNumber('default', v, {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
              })}°C`
            }
            tickStroke="currentColor"
          />
          <AxisBottom
            scale={scaleDate}
            top={height}
            numTicks={width <= 375 ? 4 : 8}
            stroke="currentColor"
            tickFormat={(d: Date) =>
              new Intl.DateTimeFormat('default', {
                day: '2-digit',
                month: '2-digit',
                year: width > 375 ? 'numeric' : undefined,
                hour: '2-digit',
                minute: '2-digit',
              }).format(d)
            }
            tickStroke="currentColor"
          />
          {width > 0 && temperature === 'OUT' && (
            <LinePath
              className={!isTemperature2 && styles.temperature}
              curve={curveNatural}
              data={data}
              x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
              y={(d: EntrySchema) => scaleTemperature(getTemperature(d)) ?? 0}
            />
          )}
          {width > 0 && temperature2 === 'OUT' && (
            <>
              <LinePath
                className={!isTemperature && styles.temperature}
                curve={curveNatural}
                data={data}
                x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
                y={(d: EntrySchema) =>
                  scaleTemperature(getTemperature2(d)) ?? 0
                }
              />
            </>
          )}
          {width > 0 && isTemperature && isTemperature2 && (
            <>
              <Threshold
                id="threshold"
                clipAboveTo={height}
                clipBelowTo={0}
                curve={curveNatural}
                data={data}
                x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
                y0={(d: EntrySchema) =>
                  scaleTemperature(getTemperature(d)) ?? 0
                }
                y1={(d: EntrySchema) =>
                  scaleTemperature(getTemperature2(d)) ?? 0
                }
              />
              <LinePath
                className={styles.intersect}
                curve={curveNatural}
                data={data}
                x={(d: EntrySchema) => scaleDate(getDate(d)) ?? 0}
                y={(d: EntrySchema) =>
                  scaleTemperature(getTemperatureIntersect(d)) ?? 0
                }
              />
            </>
          )}
        </Group>
      )}
    </svg>
  );
};

export default TemperatureChart;
