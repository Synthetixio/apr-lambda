const client = require("./db");

module.exports.handler = async (_event) => {
  try {
    await client.connect();

    const response = await client.query(
      `select ts, pool_id, collateral_type, apr_7d, apr_7d_pnl, apr_7d_rewards from base_mainnet.fct_core_apr WHERE pool_id = 1 order by ts desc limit 1;`
    );

    const { apr_7d, apr_7d_pnl, apr_7d_rewards } = response.rows[0];

    const aprPnl = parseFloat(apr_7d_pnl);
    const aprRewards = parseFloat(apr_7d_rewards);
    const aprCombined = parseFloat(apr_7d);

    return {
      statusCode: 200,
      body: JSON.stringify({
        aprPnl,
        aprRewards,
        aprCombined,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  } finally {
    await client.end();
  }
};
