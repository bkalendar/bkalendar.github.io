import { describe, it, expect } from 'vitest';
import { Entry } from '../src/lib/Entry';

describe('Entry', () => {
  it('can construct normal entry', () => {
    let entry = new Entry(
      'CO1023	Hệ thống số 	3	3	L01	2	2-4	7:00 - 9:50	H1-201	BK-CS2	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|'
    );

    expect(entry.id).toBe('CO1023');
    expect(entry.name).toBe('Hệ thống số');
    expect(entry.group).toBe('L01');
    expect(entry.wday).toBe(2);
    expect(entry.start).toBe(2);
    expect(entry.end).toBe(4);
    expect(entry.room).toBe('H1-201');
    expect(entry.weeks.first).toBe(42);
    expect(entry.weeks.others).toEqual([43, 44, 49, 50, 52, 53, 1]);

    entry = new Entry(
      'MT1004	Giải tích 1 (bài tập) 	--	--	L44	5	10-11	15:00 - 16:50	H1-103	BK-CS2	--|--|--|42|43|44|--|--|--|--|49|50|--|52|53|01|02|03|'
    );

    expect(entry.id).toBe('MT1004');
    expect(entry.start).toBe(10);
    expect(entry.weeks.first).toBe(42);
    expect(entry.weeks.others).toContain(1);

    entry = new Entry(
      'CH1003	Hóa đại cương 	3	3	L14	3	10-12	15:00 - 17:50	H2-301	BK-CS2	--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|23|'
    )

    expect(entry.weeks.first).toEqual(23);
    expect(entry.weeks.others).toEqual([]);
  });

  it('throws on invalid format', () => {
    expect(() => {
      new Entry('');
    }).toThrow();

    expect(() => {
      new Entry(
        'MI1003	Giáo dục quốc phòng 	--	1	L02	--	0-0	0:00 - 0:00	------	BK-CS1	--|--|--|--|--|--|45|46|47|48|'
      );
    }).toThrow();

    expect(() => {
      new Entry(
        'CH1004	Hóa đại cương (thí nghiệm) 	--	--	L56	4	2-5	7:00 - 10:50	H1-504	BK-CS2	--|'
      );
    }).toThrow();
  });
});
