import kuzu from 'kuzu-wasm';

kuzu.setWorkerPath('./assets/kuzu_wasm_worker.js');

const files = [
  'ENTITY_TO_TOPIC_Event_Topic.parquet',
  'ENTITY_TO_TOPIC_Location_Topic.parquet',
  'ENTITY_TO_TOPIC_Organization_Topic.parquet',
  'ENTITY_TO_TOPIC_Other_Topic.parquet',
  'ENTITY_TO_TOPIC_Person_Topic.parquet',
  'Event.parquet',
  'HAS_OBSERVATION_Event_Observation.parquet',
  'HAS_OBSERVATION_Location_Observation.parquet',
  'HAS_OBSERVATION_Organization_Observation.parquet',
  'HAS_OBSERVATION_Other_Observation.parquet',
  'HAS_OBSERVATION_Person_Observation.parquet',
  'Location.parquet',
  'Observation.parquet',
  'Organization.parquet',
  'Other.parquet',
  'Person.parquet',
  'RELATED_TO_Event_Event.parquet',
  'RELATED_TO_Event_Location.parquet',
  'RELATED_TO_Event_Organization.parquet',
  'RELATED_TO_Event_Other.parquet',
  'RELATED_TO_Event_Person.parquet',
  'RELATED_TO_Location_Event.parquet',
  'RELATED_TO_Location_Location.parquet',
  'RELATED_TO_Location_Organization.parquet',
  'RELATED_TO_Location_Other.parquet',
  'RELATED_TO_Location_Person.parquet',
  'RELATED_TO_Organization_Event.parquet',
  'RELATED_TO_Organization_Location.parquet',
  'RELATED_TO_Organization_Organization.parquet',
  'RELATED_TO_Organization_Other.parquet',
  'RELATED_TO_Organization_Person.parquet',
  'RELATED_TO_Other_Event.parquet',
  'RELATED_TO_Other_Location.parquet',
  'RELATED_TO_Other_Organization.parquet',
  'RELATED_TO_Other_Other.parquet',
  'RELATED_TO_Other_Person.parquet',
  'RELATED_TO_Person_Event.parquet',
  'RELATED_TO_Person_Location.parquet',
  'RELATED_TO_Person_Organization.parquet',
  'RELATED_TO_Person_Other.parquet',
  'RELATED_TO_Person_Person.parquet',
  'Topic.parquet',
  'copy.cypher',
  'schema.cypher'
];

export async function openKuzuDbFromExport(files) {
  const kuzuDbPath = `kuzu`;
  const kuzuExportPath = `export`;
  await ensureDirectory(kuzuDbPath);
  await ensureDirectory(kuzuExportPath);

  for (const file of files) {
    console.log(`Loading file ${file} into KuzuDB at ${kuzuDbPath}`);
    const fileContents = await getFileArrayBuffer(file);
    const bytes = new Uint8Array(fileContents);
    const filePath = `${kuzuExportPath}/${file}`;
    console.log('Writing file contents', bytes.byteLength, 'to', filePath);
    await kuzu.FS.writeFile(filePath, bytes);
  }

  const db = new kuzu.Database(kuzuDbPath);
  const conn = new kuzu.Connection(db);
  await conn.query(`IMPORT DATABASE '${kuzuExportPath}'`);
  console.log('Imported database', await (await conn.query('CALL show_tables() RETURN *;')).getAllObjects());
  await conn.close();
  return db;
}

async function getFileArrayBuffer(path) {
  const response = await fetch(`./export/${path}`);
  const fileContents = await response.arrayBuffer();
  return new Uint8Array(fileContents);
}

async function ensureDirectory(path) {
  console.log('Ensuring directory', path);
  const parts = path.split('/').filter((part) => part);
  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    console.log('Creating path', currentPath);
    try {
      await kuzu.FS.mkdir(currentPath);
    } catch (error) {
      console.warn('Error creating path', currentPath, error);
    }
  }
}

openKuzuDbFromExport(files).then(async (db) => {
  const conn = new kuzu.Connection(db);
  const result = await conn.query(`MATCH (n) WHERE list_contains(n.tags, 'Entity') RETURN n.id, n.tags;`);
  console.log(await result.getAllObjects());
  await conn.close();
});

document.querySelector('#app').innerHTML = `
  <h1>Hello Kuzu!</h1>
`
