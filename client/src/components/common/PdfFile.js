import {
    Image,
    Text,
    View,
    Page,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";
import { apiGetOrder } from "apis";
import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import logo from "../../assets/logo.png";
import moment from "moment";
import { formatMoney } from "ultils/helpers";

const styles = StyleSheet.create({
    page: {
        width: "100%",
        fontSize: 11,
        paddingTop: 20,
        paddingLeft: 40,
        paddingRight: 40,
        lineHeight: 1.5,
        flexDirection: "column",
    },

    spaceBetween: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#3E3E3E",
    },

    titleContainer: { flexDirection: "row", marginTop: 24 },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: "center" },

    addressTitle: { fontSize: 11, fontStyle: "bold" },

    invoice: { fontWeight: "bold", fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: "bold" },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
        marginTop: 20,
        fontSize: 10,
        fontStyle: "bold",
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        height: 20,
        backgroundColor: "#DEDEDE",
        borderColor: "whitesmoke",
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
        fontSize: 9,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        borderColor: "whitesmoke",
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },

    total: {
        fontSize: 9,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1.5,
        borderColor: "whitesmoke",
        borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
});

const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <Image style={styles.logo} src={logo} />
            <Text style={styles.reportTitle}>DIGITAL WORLD</Text>
        </View>
    </View>
);

const Address = (props) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <View>
                <Text style={styles.invoice}>Invoice </Text>
                <Text style={styles.invoiceNumber}>
                    Invoice number: {319083012390}{" "}
                </Text>
            </View>
            <View>
                <Text style={styles.addressTitle}>{props.address}</Text>
            </View>
        </View>
    </View>
);

const UserAddress = (props) => (
    <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
            <View style={{ maxWidth: 200 }}>
                <Text style={styles.addressTitle}>Bill to </Text>
                <Text style={styles.address}>{props.userName}</Text>
            </View>
            <Text style={styles.addressTitle}>
                {moment(props.createdAt)?.format("DD/MM/YYYY")}
            </Text>
        </View>
    </View>
);

const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
        <View style={[styles.theader, styles.theader2]}>
            <Text>Ten</Text>
        </View>
        <View style={styles.theader}>
            <Text>Gia</Text>
        </View>
        <View style={styles.theader}>
            <Text>So luong</Text>
        </View>
        <View style={styles.theader}>
            <Text>Tong</Text>
        </View>
    </View>
);

const TableBody = (props) => {
    return props.items ? (
        <>
            {props.items?.map((receipt) => (
                <Fragment key={receipt.id}>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                        <View style={[styles.tbody, styles.tbody2]}>
                            <Text>{receipt?.productName}</Text>
                        </View>

                        <View style={styles.tbody}>
                            <Text>{formatMoney(receipt?.price) + " VND"}</Text>
                        </View>
                        <View style={styles.tbody}>
                            <Text>{receipt?.quantity}</Text>
                        </View>
                        <View style={styles.tbody}>
                            <Text>
                                {formatMoney(
                                    receipt?.price * receipt?.quantity
                                ) + " VND"}
                            </Text>
                        </View>
                    </View>
                </Fragment>
            ))}
        </>
    ) : null;
};

const TableTotal = (props) => (
    <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={styles.total}>
            <Text></Text>
        </View>
        <View style={styles.total}>
            <Text> </Text>
        </View>
        <View style={styles.tbody}>
            <Text>Tong tien</Text>
        </View>
        <View style={styles.tbody}>
            <Text>{formatMoney(props.total) + " VND"}</Text>
        </View>
    </View>
);

const PdfFile = () => {
    const [order, setOrder] = useState([]);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        (async () => {
            const orderDetail = await apiGetOrder(orderId);
            setOrder(orderDetail?.metadata[0] ? orderDetail?.metadata[0] : []);
        })();
    }, []);

    return (
        <PDFViewer width="100%" height="775px" className="app">
            <Document style={{ width: "100%" }}>
                <Page size="A4" style={styles.page}>
                    <InvoiceTitle />
                    <Address address={order.address} />
                    <UserAddress
                        createdAt={order.createdAt}
                        userName={order?.lastName + " " + order?.firstName}
                    />
                    <TableHead />
                    <TableBody items={order?.orderitems} />
                    <TableTotal total={order?.total} />
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default PdfFile;
