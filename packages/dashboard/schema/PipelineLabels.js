const { tableSchema } = require('../tablePrefix');

cube(`PipelineLabels`, {
  sql: `SELECT * FROM ${tableSchema()}.pipeline_labels`,

  joins: {},

  measures: {},

  dimensions: {
    _id: {
      sql: `${CUBE}.\`_id\``,
      type: `string`,
      primaryKey: true
    },

    colorcode: {
      sql: `${CUBE}.\`colorCode\``,
      type: `string`
    },

    createdby: {
      sql: `${CUBE}.\`createdBy\``,
      type: `string`
    },

    name: {
      sql: `name`,
      type: `string`
    },

    pipelineid: {
      sql: `${CUBE}.\`pipelineId\``,
      type: `string`
    },

    type: {
      sql: `type`,
      type: `string`
    },

    createdat: {
      sql: `${CUBE}.\`createdAt\``,
      type: `time`
    }
  },

  dataSource: `default`
});
