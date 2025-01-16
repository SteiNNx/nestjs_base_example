/**
 * Mapeo de las claves abreviadas a los atributos completos de DynamoDB
 * y sus tipos.
 *
 * Este objeto se utiliza para transformar abreviaciones de claves en nombres
 * completos junto con el tipo de dato correspondiente para su uso en DynamoDB.
 *
 * @constant {Object<string, { full: string, type: string }>}
 */
const tarifasMdrMapping = {
    mcc: { full: 'mcc', type: 'S' },

    dnps: { full: 'debito_nacional_presencial_smartpos_rate', type: 'N' },
    dnpu: { full: 'debito_nacional_presencial_smartpos_uf', type: 'N' },

    dnips: { full: 'debito_nacional_integrado_presencial_rate', type: 'N' },
    dnipu: { full: 'debito_nacional_integrado_presencial_uf', type: 'N' },

    dneo: { full: 'debito_nacional_ecommerce_online_rate', type: 'N' },
    dneou: { full: 'debito_nacional_ecommerce_online_uf', type: 'N' },

    dinps: { full: 'debito_internacional_presencial_smartpos_rate', type: 'N' },
    dinpu: { full: 'debito_internacional_presencial_smartpos_uf', type: 'N' },

    diinps: { full: 'debito_internacional_integrado_presencial_rate', type: 'N' },
    diinpu: { full: 'debito_internacional_integrado_presencial_uf', type: 'N' },

    dieo: { full: 'debito_internacional_ecommerce_online_rate', type: 'N' },
    dieou: { full: 'debito_internacional_ecommerce_online_uf', type: 'N' },

    cnps: { full: 'credito_nacional_presencial_smartpos_rate', type: 'N' },
    cnpu: { full: 'credito_nacional_presencial_smartpos_uf', type: 'N' },

    cnips: { full: 'credito_nacional_integrado_presencial_rate', type: 'N' },
    cnipu: { full: 'credito_nacional_integrado_presencial_uf', type: 'N' },

    cneo: { full: 'credito_nacional_ecommerce_online_rate', type: 'N' },
    cneou: { full: 'credito_nacional_ecommerce_online_uf', type: 'N' },

    cinps: { full: 'credito_internacional_presencial_smartpos_rate', type: 'N' },
    cinpu: { full: 'credito_internacional_presencial_smartpos_uf', type: 'N' },

    ciinps: { full: 'credito_internacional_integrado_presencial_rate', type: 'N' },
    ciinpu: { full: 'credito_internacional_integrado_presencial_uf', type: 'N' },

    cieo: { full: 'credito_internacional_ecommerce_online_rate', type: 'N' },
    cieou: { full: 'credito_internacional_ecommerce_online_uf', type: 'N' },
};

/**
 * Exporta el mapeo de tarifas MDR para su uso en otros módulos.
 *
 * @type {{ tarifasMdrMapping: Object<string, { full: string, type: string }> }}
 */
module.exports = {
    tarifasMdrMapping,
};
