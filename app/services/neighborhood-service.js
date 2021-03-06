const { pool } = require("./postgres-pool");

const selectAll = () => {
  const sql = `
    select id, name, website, empower_link, nc_id, 
      certified, service_region, geometry
    from neighborhood
    order by name
  `;
  return pool.query(sql).then((res) => {
    return res.rows;
  });
};

module.exports = {
  selectAll,
};
