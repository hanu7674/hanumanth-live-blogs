import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Loading from "../../components/Loading/loading";
import { getUserDataById } from "../../redux/auth";
import { Avatar, Col, FlexboxGrid, Grid, IconButton, Panel, Row, Stack } from "rsuite";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { AdvReadMoreMore } from "read-more-more";
import FacebookOfficialIcon from '@rsuite/icons/legacy/FacebookOfficial';
import GooglePlusCircleIcon from '@rsuite/icons/legacy/GooglePlusCircle';
import TwitterIcon from '@rsuite/icons/legacy/Twitter';
import LinkedinIcon from '@rsuite/icons/legacy/Linkedin';
import GithubIcon from '@rsuite/icons/legacy/Github';
import TelegramIcon from '@rsuite/icons/legacy/Telegram';
import WhatsappIcon from '@rsuite/icons/legacy/Whatsapp';
import MediumIcon from '@rsuite/icons/legacy/Medium';
import InstagramIcon from '@rsuite/icons/legacy/Instagram';
import PinterestIcon from '@rsuite/icons/legacy/Pinterest';
import YouTubeIcon from '@rsuite/icons/legacy/Youtube';
import TiktokIcon from '@rsuite/icons/legacy/Ticket';
import SnapchatIcon from '@rsuite/icons/legacy/Snapchat';
import RedditIcon from '@rsuite/icons/legacy/Reddit';
import LinkedinLearningIcon  from '@rsuite/icons/legacy/LinkedinSquare';
import ExternalLinkIcon  from '@rsuite/icons/legacy/Globe2';
import StackOverflowIcon  from '@rsuite/icons/legacy/StackOverflow';
import CodepenIcon   from '@rsuite/icons/legacy/Codepen';
import BehanceIcon   from '@rsuite/icons/legacy/Behance';
import DribbbleIcon    from '@rsuite/icons/legacy/Dribbble';
 const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const profile = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (id) {
      dispatch(getUserDataById(id));
    }
  }, [id]);

  const renderAvatar = () => {
    return (
      <Panel bordered>
        <FlexboxGrid align="middle" justify="center" wrap>
          <FlexboxGrid.Item colspan={23}>
            <Stack justifyContent="center" alignItems="center">

              <Avatar
                circle
                style={{ width: '100px', height: '100px' }}
                imgProps={{ style: { width: '100%', height: '100%' } }}
                src={profile?.photoURL}
                name={null}
                round={true}
                alt={profile?.firstName + " " + profile?.lastName}
              />
            </Stack>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={23}>
            <div className="users-profile-name">{profile?.firstName + " " + profile?.lastName}</div>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={23}>
            <div className="users-profile-email">
              {profile?.email && <a href={`mailto:${profile?.email}`}>{profile?.email}</a>}
            </div></FlexboxGrid.Item>
        </FlexboxGrid>
      </Panel>
    );
  };

  const renderAboutMe = () => {
    return (
      <Panel
        header={<span className="users-profile-about-me-heading-content">About Me</span>}
        bordered
      >
        <p>
          {profile?.aboutMe && (
            <AdvReadMoreMore
              text={profile?.aboutMe}
              parseHtml
              color={'white'}
              checkFor={100}
              linesToShow={4}
            />
          )}
        </p>
        <Stack wrap spacing={20} style={{marginTop:'20px'}}>
          <Stack.Item>
            {renderLocation()}
          </Stack.Item>
          <Stack.Item>
            {renderPhoneNumber()}
          </Stack.Item>
        </Stack>
        {renderSocialMediaLinks()}
      </Panel>
    );
  };
  const renderSocialMediaLinks = () => {
    return (
      <Stack spacing={10} wrap justifyContent="center" alignItems="center" style={{marginTop:'20px'}}>
        {profile?.socialMediaLinks?.map((link, index) => (
          <Stack.Item>
          <a key={index} href={link.link} target="_blank" rel="noopener noreferrer">
            {getSocialMediaIcon(link.name)}
          </a>
          </Stack.Item>
        ))}
      </Stack>
    );
  };
  const getSocialMediaIcon = (type) => {
    const name = type.toLowerCase();
    switch (name) {
      case "linkedin":
        return <IconButton icon={<LinkedinIcon width={32} height={32} />} color="blue" appearance="primary" circle />;
      case "x" || 'twitter':
        return <IconButton icon={<TwitterIcon width={32} height={32} />} color="cyan" appearance="primary" circle />;
      case "facebook":
        return <IconButton icon={<FacebookOfficialIcon width={32} height={32} />} color="blue" appearance="primary" circle />;
      case "github":
        return <IconButton icon={<GithubIcon width={32} height={32} />} color="cyan" appearance="primary" circle />;
      case "telegram":
        return <IconButton icon={<TelegramIcon width={32} height={32} />} color="blue" appearance="primary" circle />;
      case "whatsapp":
        return <IconButton icon={<WhatsappIcon width={32} height={32} />} color="cyan" appearance="primary" circle />;
      case "medium":
        return <IconButton icon={<MediumIcon width={32} height={32} />} color="cyan" appearance="primary" circle />;
      case "instagram":
        return <IconButton icon={<InstagramIcon width={32} height={32} />} color="magenta" appearance="primary" circle />;
      case "pinterest":
        return <IconButton icon={<PinterestIcon width={32} height={32} />} color="red" appearance="primary" circle />;
      case "youtube":
        return <IconButton icon={<YouTubeIcon width={32} height={32} />} color="red" appearance="primary" circle />;
      case "tiktok":
        return <IconButton icon={<TiktokIcon width={32} height={32} />} color="cyan" appearance="primary" circle />;
      case "snapchat":
        return <IconButton icon={<SnapchatIcon width={32} height={32} />} color="yellow" appearance="primary" circle />;
      case "reddit":
        return <IconButton icon={<RedditIcon width={32} height={32} />} color="orange" appearance="primary" circle />;
      case "linkedin learning":
        return <IconButton icon={<LinkedinLearningIcon width={32} height={32} />} color="blue" appearance="primary" circle />;
      case "stack overflow":
        return <IconButton icon={<StackOverflowIcon width={32} height={32} />} color="orange" appearance="primary" circle />;
      case "codepen":
        return <IconButton icon={<CodepenIcon width={32} height={32} />} color="cyan" appearance="primary" circle />;
      case "behance":
        return <IconButton icon={<BehanceIcon width={32} height={32} />} color="blue" appearance="primary" circle />;
      case "dribbble":
        return <IconButton icon={<DribbbleIcon width={32} height={32} />} color="pink" appearance="primary" circle />;
      default:
        return <IconButton icon={<ExternalLinkIcon width={32} height={32} />} color="red" appearance="primary" circle />;
    }
  };
  const renderLocation = () => {
    return (
      profile?.address1 && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
          className="text-muted"
          href={`https://www.google.com/maps/search/?api=1&query=${profile?.address1 +
            " " +
            profile?.address2 +
            " " +
            profile?.city +
            " " +
            profile?.country}`}
        >
          <Stack spacing={5} wrap alignItems="flex-start" justifyContent="flex-start">
            <FaLocationDot />
            <span>
              {profile?.address1}, {profile?.address2}, {profile?.city}, {profile?.country}.
            </span>
          </Stack>
        </a>
      )
    );
  };

  const renderPhoneNumber = () => {
    return (
      profile?.phoneNumber && (
        <Stack spacing={5} alignItems="flex-start" justifyContent="flex-start">
          <FaPhone />
          <a
            className="text-muted"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
            href={`tel:${profile?.phoneNumber}`}
          >
            {profile?.phoneNumber}
          </a>
        </Stack>
      )
    );
  };

  return (  
    <>
      {loading ? (
        <Loading />
      ) : (
        <FlexboxGrid justify="center" align="middle" style={{ height: '100vh' }}>
          <FlexboxGrid.Item colspan={18}>
            <Grid fluid>
              <Row gutter={20}>
                <Col md={10} xs={24} style={{ marginTop: '20px' }}>
                  <FlexboxGrid justify="center">
                    <div className="avatar-container">
                      {renderAvatar()}
                    </div>
                  </FlexboxGrid>
                </Col>
                <Col md={14} xs={24} style={{ marginTop: '20px' }}>
                  <FlexboxGrid justify="center">
                    <div className="about-me-container">
                      {renderAboutMe()}
                    </div>
                  </FlexboxGrid>
                </Col>
              </Row>
            </Grid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      )}
    </>
  );
};

export default UserProfile;
