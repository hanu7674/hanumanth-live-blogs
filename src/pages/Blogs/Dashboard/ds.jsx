import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ApexChart, Badge, Card, Row, Col } from "rsuite";
import { fetchDashboardData } from "../redux/actions/dashboardActions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <div>
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <h2>Website Traffic</h2>
              <Row>
                <Col xs={6}>
                  <ApexChart
                    options={{
                      chart: {
                        id: "website-traffic-chart",
                      },
                      xaxis: {
                        categories: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                      },
                      yaxis: {
                        title: "Number of Visitors",
                      },
                      stroke: {
                        curve: "smooth",
                      },
                      fill: {
                        type: "gradient",
                        gradient: {
                          shade: "dark",
                          type: "vertical",
                          shadeIntensity: 0.5,
                          gradientToColors: ["#87D068"],
                          inverseColors: false,
                          opacityFrom: 1,
                          opacityTo: 0.5,
                          stops: [0, 100],
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                    }}
                    series={[
                      {
                        name: "Unique Visitors",
                        data: dashboardData?.websiteTraffic?.uniqueVisitors,
                      },
                    ]}
                    type="area"
                    height={300}
                  />
                </Col>
                <Col xs={6}>
                  <div>
                    <h4>Total Visits</h4>
                    <Badge>{dashboardData?.websiteTraffic?.totalVisits}</Badge>
                  </div>
                  <div>
                    <h4>Average Time on Page</h4>
                    <Badge>{dashboardData?.websiteTraffic?.avgTimeOnPage}</Badge>
                  </div>
                  <div>
                    <h4>Pageviews</h4>
                    <Badge>{dashboardData?.websiteTraffic?.pageviews}</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <h2>Blog Performance</h2>
              <Row>
                <Col xs={6}>
                  <ApexChart
                    options={{
                      chart: {
                        id: "blog-performance-chart",
                      },
                      xaxis: {
                        categories: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                      },
                      yaxis: {
                        title: "Number of Posts",
                      },
                      stroke: {
                        curve: "smooth",
                      },
                      fill: {
                        type: "gradient",
                        gradient: {
                          shade: "dark",
                          type: "vertical",
                          shadeIntensity: 0.5,
                          gradientToColors: ["#40C4FF"],
                          inverseColors: false,
                          opacityFrom: 1,
                          opacityTo: 0.5,
                          stops: [0, 100],
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                    }}
                    series={[
                      {
                        name: "Total Posts",
                        data: dashboardData?.blogPerformance?.totalPosts,
                      },
                      {
                        name: "Active Posts",
                        data: dashboardData?.blogPerformance?.activePosts,
                      },
                    ]}
                    type="area"
                    height={300}
                  />
                </Col>
                <Col xs={6}>
                  <div>
                    <h4>Average Post Length</h4>
                    <Badge>{dashboardData?.blogPerformance?.avgPostLength}</Badge>
                  </div>
                  <div>
                    <h4>Total Comments</h4>
                    <Badge>{dashboardData?.blogPerformance?.totalComments}</Badge>
                  </div>
                  <div>
                    <h4>Top Performing Post</h4>
                    <Badge>{dashboardData?.blogPerformance?.topPerformingPost}</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <h2>User Engagement</h2>
              <Row>
                <Col xs={6}>
                  <ApexChart
                    options={{
                      chart: {
                        id: "user-engagement-chart",
                      },
                      xaxis: {
                        categories: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                      },
                      yaxis: {
                        title: "Number of Subscribers",
                      },
                      stroke: {
                        curve: "smooth",
                      },
                      fill: {
                        type: "gradient",
                        gradient: {
                          shade: "dark",
                          type: "vertical",
                          shadeIntensity: 0.5,
                          gradientToColors: ["#FF9F43"],
                          inverseColors: false,
                          opacityFrom: 1,
                          opacityTo: 0.5,
                          stops: [0, 100],
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                    }}
                    series={[
                      {
                        name: "Subscribers",
                        data: dashboardData?.userEngagement?.subscribers,
                      },
                    ]}
                    type="area"
                    height={300}
                  />
                </Col>
                <Col xs={6}>
                  <div>
                    <h4>Newsletter Open Rate</h4>
                    <Badge>{dashboardData?.userEngagement?.newsletterOpenRate}</Badge>
                  </div>
                  <div>
                    <h4>Social Media Followers</h4>
                    <Badge>{dashboardData?.userEngagement?.socialMediaFollowers}</Badge>
                  </div>
                  <div>
                    <h4>Engagement Rate on Social Media</h4>
                    <Badge>{dashboardData?.userEngagement?.socialMediaEngagementRate}</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <h2>Sales and Conversions</h2>
              <Row>
                <Col xs={6}>
                  <ApexChart
                    options={{
                      chart: {
                        id: "sales-conversions-chart",
                      },
                      xaxis: {
                        categories: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                      },
                      yaxis: {
                        title: "Revenue (USD)",
                      },
                      stroke: {
                        curve: "smooth",
                      },
                      fill: {
                        type: "gradient",
                        gradient: {
                          shade: "dark",
                          type: "vertical",
                          shadeIntensity: 0.5,
                          gradientToColors: ["#66DA2F"],
                          inverseColors: false,
                          opacityFrom: 1,
                          opacityTo: 0.5,
                          stops: [0, 100],
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                    }}
                    series={[
                      {
                        name: "Affiliate Revenue",
                        data: dashboardData?.salesAndConversions?.affiliateRevenue,
                      },
                      {
                        name: "Sponsored Post Revenue",
                        data: dashboardData?.salesAndConversions?.sponsoredPostRevenue,
                      },
                      {
                        name: "Product Sales",
                        data: dashboardData?.salesAndConversions?.productSales,
                      },
                    ]}
                    type="area"
                    height={300}
                  />
                </Col>                <Col xs={6}>
                  <div>
                    <h4>Total Affiliate Revenue</h4>
                    <Badge>{dashboardData?.salesAndConversions?.totalAffiliateRevenue}</Badge>
                  </div>
                  <div>
                    <h4>Total Sponsored Post Revenue</h4>
                    <Badge>{dashboardData?.salesAndConversions?.totalSponsoredPostRevenue}</Badge>
                  </div>
                  <div>
                    <h4>Total Product Sales</h4>
                    <Badge>{dashboardData?.salesAndConversions?.totalProductSales}</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;