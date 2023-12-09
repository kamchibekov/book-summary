import React, { useContext } from "react";
import { View, Image, Heading, Text, Button, Grid } from "@adobe/react-spectrum";
import { DashboardContext } from "../contexts";
import Constants from "../constants";

const ImageCard = ({ index, src, title, desc }) => {
    const { setSelectedAction, setSelectedSummary } = useContext(DashboardContext)

    const handleContentChange = () => {
        setSelectedAction(Constants.SUMMARY_CONTENT)
        setSelectedSummary(index)
    }

    return (
        <View
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-100">

            <Grid
                areas={[
                    'sidebar content',
                ]}
                columns={['1fr', '3fr']}
                gap="size-100">
                <View backgroundColor="blue-600" gridArea="sidebar">
                    <Image
                        src={src}
                        alt={title}
                    />
                </View>
                <Grid
                    areas={['title', 'description', 'footer']}
                    columns={['1fr']}
                    rows={['auto', '1fr', 'auto']}
                    height="100%"
                    gap="size-100"
                >
                    <View gridArea="title">
                        <Heading level={4}>
                            {title}
                        </Heading>
                    </View>

                    <View gridArea="description">
                        <Text>{desc}</Text>
                    </View>

                    <View gridArea="footer">
                        <Button variant="secondary" onPress={handleContentChange}>
                            Read
                        </Button>
                    </View>
                </Grid>
            </Grid>
        </View>

    );
};

export default ImageCard;