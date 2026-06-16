import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmLeadRoundRobinStateAttributes {
  branch_id: number;
  last_employee_id: number | null;
  created_at: Date;
  updated_at: Date;
}

interface DmLeadRoundRobinStateCreationAttributes extends Optional<DmLeadRoundRobinStateAttributes, 'last_employee_id' | 'created_at' | 'updated_at'> {}

class DmLeadRoundRobinState extends Model<DmLeadRoundRobinStateAttributes, DmLeadRoundRobinStateCreationAttributes> implements DmLeadRoundRobinStateAttributes {
  public branch_id!: number;
  public last_employee_id!: number | null;
  public created_at!: Date;
  public updated_at!: Date;

  public static associate(models: any) {
    DmLeadRoundRobinState.belongsTo(models.DmBranch, { foreignKey: 'branch_id', targetKey: 'id', as: 'branch' });
    DmLeadRoundRobinState.belongsTo(models.DmEmployee, { foreignKey: 'last_employee_id', targetKey: 'id', as: 'lastEmployee' });
  }
}

DmLeadRoundRobinState.init(
  {
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    last_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'DmLeadRoundRobinState',
    tableName: 'dm_lead_round_robin_state',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

export { DmLeadRoundRobinState };
export type { DmLeadRoundRobinStateAttributes, DmLeadRoundRobinStateCreationAttributes };
