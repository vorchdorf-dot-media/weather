import { useMemo } from 'preact/hooks';
import { curveNatural } from '@visx/curve';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { extent } from 'd3-array';
import type { EntrySchema } from 'functions/dist/db/schemata/entry';

import styles from 'components/Chart/LineChart.module.css';

const getDate = ({ timestamp }: EntrySchema): number =>
  Date.parse((timestamp as unknown) as string);
const getValue = ({ temperature2 }: EntrySchema): number =>
  temperature2 as number;

const LineChart = ({
  data,
  height,
  width,
}: {
  data: EntrySchema[];
  height: number;
  width: number;
}): JSX.Element => {
  const scaleX = useMemo(
    () =>
      scaleTime<number>({
        domain: extent(data, getDate) as number[],
        range: [0, width],
      }),
    [data, width]
  );
  const scaleY = useMemo(
    () =>
      scaleLinear<number>({
        domain: extent(data, getValue) as number[],
        range: [height - 100, 100],
      }),
    [data, height]
  );

  return (
    <svg className={styles.chart} width={width} height={height}>
      <LinePath
        curve={curveNatural}
        data={data}
        x={(d: EntrySchema) => scaleX(getDate(d)) ?? 0}
        y={(d: EntrySchema) => scaleY(getValue(d)) ?? 0}
      />
    </svg>
  );
};

export default LineChart;
