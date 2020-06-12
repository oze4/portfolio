import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import EditPost from '../containers/EditPost';

import styles from '../styles/EditModal.module.scss';

const muiStyles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    top: '50%',
    left: '50%',
    outline: 'none',
    transform: 'translate(-50%, -50%)'
  },
  spacing: {
    marginBottom: '10px'
  }
});

class EditModal extends Component {
  state = {
    name: ''
  };

  render() {
    const {
      _id,
      isEditingComment,
      classes,
      commentPostId,
      editPost,
      handleModalClose,
      modalOpen,
      title,
      body
    } = this.props;
    const { name } = this.state;

    return (
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={modalOpen}
        onClose={handleModalClose}
      >
        <div className={classes.paper + ' ' + styles.paper}>
          <Typography
            variant="h6"
            id="modal-title"
            className={classes.spacing}
          >
            {isEditingComment ? 'Edit this comment' : 'Edit this post'}
          </Typography>
          <Typography variant="h6" id="modal-description">
            <EditPost
              author={name}
              commentPostId={commentPostId}
              editPost={editPost}
              handleModalClose={handleModalClose}
              id={_id}
              isEditingComment={isEditingComment}
              title={title}
              body={body}
            />
          </Typography>
        </div>
      </Modal>
    );
  }
}

EditModal.defaultProps = {
  commentPostId: '',
  isEditingComment: false
};

EditModal.propTypes = {
  _id: PropTypes.string.isRequired,
  isEditingComment: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  commentPostId: PropTypes.string,
  editPost: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
};

export default withStyles(muiStyles)(EditModal);
