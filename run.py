import logging
from app import create_app

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

try:
    app = create_app()
    logger.info("Application created successfully")
except Exception as e:
    logger.error(f"Error creating application: {str(e)}")
    raise

if __name__ == '__main__':
    try:
        logger.info("Starting application...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"Error running application: {str(e)}")
        raise
