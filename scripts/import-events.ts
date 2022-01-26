import fs from 'fs/promises';
// @ts-ignore
import ICAL from 'ical.js';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;
dayjs.extend(utc);
dayjs.extend(timezone);

if (process.argv.length < 3) {
  console.log(
    'Usage: node --loader ts-node/esm ' + process.argv[1] + ' FILENAME'
  );
  process.exit(1);
}
const filename = process.argv[2];
const data = await fs.readFile(filename, 'utf8');

const cal = ICAL.parse(data);
const comp = new ICAL.Component(cal);
const raw = comp.getAllSubcomponents('vevent');
const events: {
  title: string;
  categories: string[];
  start: Dayjs;
  end: Dayjs;
}[] = raw.map((r: any) => {
  const event = new ICAL.Event(r, {});
  // console.log([
  //   event.summary,
  //   event.startDate.toJSDate(),
  //   dayjs.tz(event.startDate.toJSDate(), 'Europe/Copenhagen').format(),
  //   dayjs.utc(event.endDate.toJSDate()).tz('Europe/Copenhagen', true).format(),
  // ]);
  return {
    title: event.summary,
    categories: r
      .getFirstPropertyValue('categories')
      .split(',')
      .map((x: string) => x.trim()),
    start: dayjs.utc(event.startDate.toJSDate()).tz('Europe/Copenhagen', true),
    end: dayjs.utc(event.endDate.toJSDate()).tz('Europe/Copenhagen', true),
  };
});

type TAG = 'info' | 'medlemsaften' | 'pride' | 'åbenthus' | 'party';
type GROUP =
  | 'kink youth'
  | 'peer whip'
  | 'domini noctis'
  | 'peer rope'
  | 'queer'
  | 'poly'
  | 'academy';

interface Event {
  start: Dayjs;
  end: Dayjs;
  tags: TAG[];
  groups: GROUP[];
  translations: {
    languageCode: 'EN' | 'DA';
    title: string;
  }[];
}

const toCreateRaw: Event[] = [];

for (let event of events) {
  if (event.title.toLowerCase() === 'medlemsaften') {
    if (event.start.date() === 29 && event.start.month() === 0) continue;
    if (event.start.date() === 26 && event.start.month() === 2) continue;
    toCreateRaw.push({
      start: event.start,
      end: event.start.add(7, 'hour'),
      tags: ['medlemsaften'],
      groups: [],
      translations: [
        { languageCode: 'EN', title: 'Members Night' },
        { languageCode: 'DA', title: 'Medlemsaften' },
      ],
    });
  } else if (event.title.toLowerCase() === 'ny i smil') {
    toCreateRaw.push({
      start: event.start.hour(20).minute(30),
      end: event.start.hour(23).minute(0),
      tags: [],
      groups: [],
      translations: [
        { languageCode: 'EN', title: 'New to SMil' },
        { languageCode: 'DA', title: 'Ny i SMil' },
      ],
    });
  } else if (event.title.toLowerCase().includes('regular kink youth night')) {
    toCreateRaw.push({
      start: event.start,
      end: event.start.add(7, 'hour'),
      tags: [],
      groups: ['kink youth'],
      translations: [
        { languageCode: 'EN', title: 'Regular Kink Youth Night' },
        { languageCode: 'DA', title: 'Normal Kink Youth Aften' },
      ],
    });
  } else if (event.title.toLowerCase().includes('peerwhip')) {
    toCreateRaw.push({
      start: event.start.day() == 5 ? event.start.hour(15) : event.start,
      end: event.end.day() == 5 ? event.end.hour(19) : event.end,
      tags: [],
      groups: ['peer whip'],
      translations: [
        { languageCode: 'EN', title: 'Peer Whip' },
        { languageCode: 'DA', title: 'Peer Whip' },
      ],
    });
  } else if (event.title.toLowerCase().includes('domini noctis')) {
    toCreateRaw.push({
      start: event.start.hour(15).minute(0),
      end: event.start.hour(19).minute(0),
      tags: [],
      groups: ['domini noctis'],
      translations: [
        { languageCode: 'EN', title: 'Domini Noctis' },
        { languageCode: 'DA', title: 'Domini Noctis' },
      ],
    });
  } else if (event.title.toLowerCase().includes('informationsaften')) {
    toCreateRaw.push({
      start: event.start,
      end: event.end,
      tags: ['info'],
      groups: [],
      translations: [
        { languageCode: 'EN', title: 'Information night' },
        { languageCode: 'DA', title: 'Informationsaften' },
      ],
    });
  } else if (event.title.toLowerCase().includes('queer playnight')) {
    toCreateRaw.push({
      start: event.start,
      end: event.end,
      tags: [],
      groups: ['queer'],
      translations: [
        { languageCode: 'EN', title: 'Queer Playnight' },
        { languageCode: 'DA', title: 'Queer Legeaften' },
      ],
    });
  } else if (event.title.toLowerCase().includes('peer rope')) {
    toCreateRaw.push({
      start: event.start,
      end: event.end,
      tags: [],
      groups: ['peer rope'],
      translations: [
        {
          languageCode: 'EN',
          title: event.title.toLowerCase().includes('begyndere')
            ? 'Peer Rope - Beginners'
            : 'Peer Rope - Advanced',
        },
        {
          languageCode: 'DA',
          title: event.title.toLowerCase().includes('begyndere')
            ? 'Peer Rope - Begyndere'
            : 'Peer Rope - Øvede',
        },
      ],
    });
  } else if (
    event.title.toLowerCase().includes('kink youth') &&
    event.title.toLowerCase().includes('party')
  ) {
    toCreateRaw.push({
      start: event.start,
      end: event.start.add(7, 'hour'),
      tags: ['party'],
      groups: ['kink youth'],
      translations: [
        {
          languageCode: 'EN',
          title: event.title.toLowerCase().includes('late summer')
            ? 'Kink Youth Late Summer Party'
            : event.title.toLowerCase().includes('halloween')
            ? 'Kink Youth Halloween Party'
            : 'Kink Youth Spring/Easter Party',
        },
        {
          languageCode: 'DA',
          title: event.title.toLowerCase().includes('late summer')
            ? 'Kink Youth Sensommer Party'
            : event.title.toLowerCase().includes('halloween')
            ? 'Kink Youth Halloweenfest'
            : 'Kink Youth Forår-/påskefest',
        },
      ],
    });
  } else if (event.title.toLowerCase().includes('poly-forhold')) {
    toCreateRaw.push({
      start: event.start,
      end: event.end,
      tags: [],
      groups: ['poly'],
      translations: [
        { languageCode: 'EN', title: 'Poly-relationships' },
        { languageCode: 'DA', title: 'Poly-forhold' },
      ],
    });
  } else if (event.title.toLowerCase().includes('kink academy')) {
    toCreateRaw.push({
      start: event.start,
      end: event.end,
      tags: [],
      groups: ['academy'],
      translations: [
        {
          languageCode: 'EN',
          title: event.title.toLowerCase().includes('ydmygelse')
            ? 'Kink Academey - Humiliation'
            : 'Kink Academy - Kink and psycology',
        },
        {
          languageCode: 'DA',
          title: event.title.toLowerCase().includes('ydmygelse')
            ? 'Kink Academey - Ydmygelse'
            : 'Kink Academy - Kink og psykologi',
        },
      ],
    });
  } else if (event.title.toLowerCase().includes('aarhus pride')) {
    toCreateRaw.push({
      start: event.start,
      end: event.end,
      tags: [
        'pride',
        ...(event.title.toLowerCase().includes('åbent')
          ? (['åbenthus'] as TAG[])
          : []),
      ],
      groups: [],
      translations: [
        {
          languageCode: 'EN',
          title: event.title.toLowerCase().includes('åbent')
            ? 'Aarhus Pride - Open House'
            : 'Aarhus Pride',
        },
        {
          languageCode: 'DA',
          title: event.title.toLowerCase().includes('åbent')
            ? 'Aarhus Pride - Åbent Hus'
            : 'Aarhus Pride',
        },
      ],
    });
  } else if (event.title.toLowerCase().includes('medlemsaften og gæsteaften')) {
    toCreateRaw.push({
      start: event.start,
      end: event.start.add(7, 'hour'),
      tags: ['medlemsaften'],
      groups: [],
      translations: [
        {
          languageCode: 'EN',
          title: 'Members- and Guest night',
        },
        {
          languageCode: 'DA',
          title: 'Medlems- og Gæsteaften',
        },
      ],
    });
  } else {
    console.warn(event);
  }
}

const groupMap: Record<GROUP, string> = {
  'domini noctis': 'fddd1243-6f60-4b72-9ad6-9f3884b91efd',
  'kink youth': 'b6b2897c-d855-4298-b368-472112246227',
  queer: '03f86eb0-2e3c-4906-b5c8-0dc0d0258ecc',
  'peer whip': '47ff772e-b4af-4a23-8865-e3f7f5f5bc6a',
  'peer rope': 'f2d8aeaa-2750-4fb5-b505-65ee349087c7',
  academy: 'fb6589b3-0825-4ab7-bc3f-e9e7188dced1',
  poly: 'c98e9c2b-dd00-4413-bd61-77a52ddefb32',
};

const tagMap: Record<TAG, string> = {
  info: '4dd6f6a3-3b46-450a-850c-18a4bb69fe07',
  medlemsaften: '2cf989bf-6b2a-43c2-994a-fc27ec5bb173',
  party: '5f7644f2-5039-4c4c-b1ab-70b0787832ac',
  pride: '144a3104-6eb2-471f-be96-4b67c79adb76',
  åbenthus: '9f4e55e2-9215-4173-958c-7bacd96e4820',
};

const toCreate = {
  event: [] as [string, string, string, Boolean][],
  eventTr: [] as [string, string, string, string][],
  eventViaGroup: [] as [string, string][],
  eventViaEventTag: [] as [string, string][],
};

for (let e of toCreateRaw) {
  const id = uuidv4();
  toCreate.event.push([id, e.start.format(), e.end.format(), false]);
  for (let t of e.translations) {
    toCreate.eventTr.push([id, t.languageCode, t.title, '']);
  }
  for (let g of e.groups) {
    toCreate.eventViaGroup.push([id, groupMap[g]]);
  }
  for (let t of e.tags) {
    toCreate.eventViaEventTag.push([id, tagMap[t]]);
  }
}

let s = '';

s += `INSERT INTO smil_aarhus.event ("id", "starts_at", "ends_at", "special") VALUES\n`;
s += toCreate.event
  .map((x) => `\t(${x.map((q) => `'${q}'`).join(',')})`)
  .join(',\n');
s += ';\n\n';

s += `INSERT INTO smil_aarhus.event_tr ("event_id", "language_code", "title", "description") VALUES\n`;
s += toCreate.eventTr
  .map((x) => `\t(${x.map((q) => `'${q}'`).join(',')})`)
  .join(',\n');
s += ';\n\n';

s += `INSERT INTO smil_aarhus.event_via_group ("event_id", "group_id") VALUES\n`;
s += toCreate.eventViaGroup
  .map((x) => `\t(${x.map((q) => `'${q}'`).join(',')})`)
  .join(',\n');
s += ';\n\n';

s += `INSERT INTO smil_aarhus.event_via_event_tag ("event_id", "tag_id") VALUES\n`;
s += toCreate.eventViaEventTag
  .map((x) => `\t(${x.map((q) => `'${q}'`).join(',')})`)
  .join(',\n');
s += ';\n\n';

console.log(s);
