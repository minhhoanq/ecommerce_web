import { Client } from "@elastic/elasticsearch";

// Định nghĩa kiểu cho cấu hình Elasticsearch
interface ElasticsearchConfig {
    ELASTICSEARCH_IS_ENABLED: boolean;
    ELASTICSEARCH_HOSTS?: string;
}

// Định nghĩa kiểu cho đối tượng chứa các kết nối Elasticsearch
interface Clients {
    elasticClient?: Client;
}

// Khởi tạo đối tượng chứa các kết nối
let clients: Clients = {};

// Hàm kiểm tra kết nối Elasticsearch và đăng ký các sự kiện liên quan
const instanceEventListeners = async (elasticClient: Client) => {
    try {
        await elasticClient.ping();
        console.log(`Successfully connected to Elasticsearch`);
    } catch (error) {
        console.log(`Error connecting to Elasticsearch: `, error);
    }
};

// Hàm khởi tạo kết nối Elasticsearch với cấu hình truyền vào
const init = ({
    ELASTICSEARCH_IS_ENABLED,
    ELASTICSEARCH_HOSTS = "http://localhost:9200",
}: ElasticsearchConfig): void => {
    if (ELASTICSEARCH_IS_ENABLED) {
        const elasticClient = new Client({ node: ELASTICSEARCH_HOSTS });
        clients.elasticClient = elasticClient;
        // Xử lý kết nối và đăng ký sự kiện
        instanceEventListeners(elasticClient);
    }
};

// Hàm trả về các kết nối Elasticsearch
const getClients = (): Clients => clients;

// Hàm đóng các kết nối Elasticsearch (hiện tại chưa triển khai)
const closeConnectionsEs = (): void => {
    if (clients.elasticClient) {
        clients.elasticClient.close();
    }
};

export default {
    init,
    getClients,
    closeConnectionsEs,
};
