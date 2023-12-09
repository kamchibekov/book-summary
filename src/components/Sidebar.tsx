import React, { useContext, useState } from "react";
import { Flex, Button, View, ButtonGroup } from '@adobe/react-spectrum';
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import Bookmark from "@spectrum-icons/workflow/Bookmark";
import BookmarkSingleOutline from "@spectrum-icons/workflow/BookmarkSingleOutline";
import AutomatedSegment from "@spectrum-icons/workflow/AutomatedSegment";
import Profile from './profile'
import Strings from "../strings";
import Constants from "../constants";
import { DashboardContext } from '../contexts'


const Sidebar = ({ user }) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { selectedAction, setSelectedAction } = useContext(DashboardContext)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAction = (selected: string) => {
        setSelectedAction(selected)
    }

    return (
        <>
            <View
                height="100%"
                width={isSidebarOpen ? "size-3000" : "size-675"}
            >
                <Flex
                    direction="column"
                    height="100%"
                    justifyContent="center"
                    gap="size-300"
                >
                    <ButtonGroup orientation="vertical" align="center" alignSelf="center">
                        <Button
                            variant="secondary"
                            onPress={() => handleAction(Constants.SIDEBAR_TODAY)}
                            isDisabled={selectedAction === Constants.SIDEBAR_TODAY}
                        >
                            <AutomatedSegment /> {isSidebarOpen ? Strings.todaysBlink : ''}
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={() => handleAction(Constants.SIDEBAR_LIBRARY)}
                            isDisabled={selectedAction === Constants.SIDEBAR_LIBRARY}
                        >
                            <Bookmark /> {isSidebarOpen ? Strings.library : ''}
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={() => handleAction(Constants.SIDEBAR_HIGHLIGHTS)}
                            isDisabled={selectedAction === Constants.SIDEBAR_HIGHLIGHTS}
                        >
                            <BookmarkSingleOutline /> {isSidebarOpen ? Strings.highlights : ''}
                        </Button>
                    </ButtonGroup>
                    <Profile user={user} isSidebarOpen={isSidebarOpen} />
                </Flex>
            </View>

            {/* Toggle Button */}
            <Button variant="secondary"
                alignSelf="center"
                onPress={toggleSidebar}
                marginEnd="-16px"
                style="fill"

            >
                {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
        </>
    );
};


export default Sidebar;
