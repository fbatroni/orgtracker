import Sequelize from 'sequelize';
const DataTypes = Sequelize.DataTypes;
const sequelize = dbManager.getSequelizeClient();

const Organization = sequelize.define('organizations', {
  orgname: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  numberOfEmployees: {
    type: DataTypes.INTEGER,
    allowNull: true,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Organization.findBySearchCriteria = async (criteria) => {
  let foundOrg = await Organization.findOne({
    where: criteria,
  });

  return foundOrg;
};

export default Organization;
