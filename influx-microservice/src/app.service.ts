import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client'


import { config } from 'dotenv';
config();




@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Influx!';
  }

  async influx() {
    const token = process.env.INFLUXDB_TOKEN
    const url = 'http://localhost:8086'
    const client = new InfluxDB({ url, token })

    let org = `test-org`
    let bucket = `test-bucket`

    let writeClient = client.getWriteApi(org, bucket, 'ns')

    for (let i = 0; i < 5; i++) {
      let point = new Point('measurement1')
        .tag('tagname1', 'tagvalue1')
        .intField('field1', i)

      await setTimeout(() => {
        writeClient.writePoint(point)
      }, i * 1000) // separate points by 1 second

      await setTimeout(() => {
        writeClient.flush()
      }, 5000)
    }
  }
}
